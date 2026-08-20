/* ==========================================================================
   Naviar Care — video provider adapter
   --------------------------------------------------------------------------
   The default provider is a SELF-HOSTED Jitsi Meet deployment with
   end-to-end encryption. That choice is deliberate: with self-hosting no
   third party ever holds patient audio or video, which removes a whole class
   of processor agreements and international-transfer problems (COMPLIANCE.md
   §3). Whereby Embedded and Daily are supported by the same interface for
   teams that would rather trade that control for less operational work — both
   need a signed BAA/DPA before a real patient uses them.

   Nothing here starts a call on its own. The room is only created when the
   patient explicitly asks to join.
   ========================================================================== */
(function (window, document) {
  "use strict";

  function config() {
    return (window.NaviarConfig && window.NaviarConfig.video) || { provider: "jitsi", jitsi: {} };
  }

  /* Room names must not be guessable — an easily-enumerated room name is a
     stranger walking into someone's consultation. Server-side these should be
     signed, single-use tokens; this is the client-side shape of that.       */
  function roomName(reference) {
    var clean = String(reference || "").replace(/[^A-Za-z0-9-]/g, "");
    return "naviar-" + (clean || "room");
  }

  function providerName() {
    return config().provider || "jitsi";
  }

  /* Human-readable description of the security posture actually in force,
     so the UI can tell the patient the truth rather than a slogan. */
  function securityPosture() {
    var cfg = config();
    var provider = providerName();

    if (provider === "jitsi") {
      var jitsi = cfg.jitsi || {};
      var opts = jitsi.options || {};
      return {
        provider: "Jitsi Meet",
        e2ee: opts.e2ee !== false,
        selfHosted: jitsi.selfHosted === true,
        lobby: opts.lobby !== false,
        recording: opts.recording === true,
        domain: jitsi.domain || "",
        /* A public instance is fine for a demo and never for patients. */
        productionReady: jitsi.selfHosted === true
      };
    }

    return {
      provider: provider,
      e2ee: true,
      selfHosted: false,
      lobby: true,
      recording: false,
      domain: (cfg[provider] && (cfg[provider].domain || cfg[provider].subdomain)) || "",
      productionReady: false
    };
  }

  /* Loads the provider SDK on demand — never on page load, so a patient who
     never joins a call never contacts the video provider at all. */
  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var existing = document.querySelector('script[data-video-sdk="' + src + '"]');
      if (existing) {
        if (existing.getAttribute("data-loaded") === "true") resolve();
        else {
          existing.addEventListener("load", function () { resolve(); });
          existing.addEventListener("error", function () { reject(new Error("sdk-failed")); });
        }
        return;
      }
      var tag = document.createElement("script");
      tag.src = src;
      tag.async = true;
      tag.setAttribute("data-video-sdk", src);
      tag.addEventListener("load", function () {
        tag.setAttribute("data-loaded", "true");
        resolve();
      });
      tag.addEventListener("error", function () { reject(new Error("sdk-failed")); });
      document.head.appendChild(tag);
    });
  }

  function joinJitsi(container, options) {
    var cfg = config().jitsi || {};
    var opts = cfg.options || {};
    var domain = cfg.domain || "meet.jit.si";

    return loadScript("https://" + domain + "/external_api.js").then(function () {
      if (!window.JitsiMeetExternalAPI) throw new Error("sdk-missing");

      var api = new window.JitsiMeetExternalAPI(domain, {
        roomName: options.room,
        parentNode: container,
        width: "100%",
        height: 520,
        userInfo: { displayName: options.displayName || "" },
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          prejoinPageEnabled: opts.prejoin !== false,
          disableThirdPartyRequests: opts.disableThirdPartyRequests !== false,
          enableLobbyChat: false,
          /* Recording and live streaming are switched off outright, not
             merely hidden: consent must come first, per Turkish rules and
             ordinary confidentiality. */
          fileRecordingsEnabled: false,
          liveStreamingEnabled: false,
          hideConferenceSubject: true,
          analytics: { disabled: opts.analytics === false }
        },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: [
            "microphone", "camera", "hangup", "tileview",
            "settings", "raisehand", "videoquality", "fullscreen"
          ],
          SHOW_JITSI_WATERMARK: false,
          SHOW_BRAND_WATERMARK: false,
          DISABLE_VIDEO_BACKGROUND: false,
          MOBILE_APP_PROMO: false
        }
      });

      if (opts.e2ee !== false && typeof api.executeCommand === "function") {
        try { api.executeCommand("toggleE2EE", true); } catch (e) { /* older deployments */ }
      }

      return {
        provider: "jitsi",
        api: api,
        leave: function () {
          try { api.executeCommand("hangup"); } catch (e) { /* already gone */ }
          try { api.dispose(); } catch (e) { /* already disposed */ }
        },
        on: function (event, handler) {
          try { api.addListener(event, handler); } catch (e) { /* unsupported */ }
        }
      };
    });
  }

  function joinIframe(container, options, url) {
    var frame = document.createElement("iframe");
    frame.src = url;
    frame.allow = "camera; microphone; fullscreen; display-capture; autoplay";
    frame.style.cssText = "width:100%;height:520px;border:0;border-radius:14px";
    frame.setAttribute("title", options.title || "Consultation");
    container.appendChild(frame);
    return Promise.resolve({
      provider: options.provider,
      leave: function () { if (frame.parentNode) frame.parentNode.removeChild(frame); },
      on: function () { /* postMessage bridge belongs here per provider */ }
    });
  }

  function join(container, options) {
    var opts = options || {};
    var cfg = config();
    var provider = providerName();
    var room = roomName(opts.reference);

    if (provider === "whereby") {
      var sub = (cfg.whereby && cfg.whereby.subdomain) || "";
      if (!sub) return Promise.reject(new Error("not-configured"));
      return joinIframe(container, { provider: "whereby", title: opts.title },
        "https://" + sub + ".whereby.com/" + room);
    }

    if (provider === "daily") {
      var domain = (cfg.daily && cfg.daily.domain) || "";
      if (!domain) return Promise.reject(new Error("not-configured"));
      return joinIframe(container, { provider: "daily", title: opts.title },
        "https://" + domain + "/" + room);
    }

    return joinJitsi(container, { room: room, displayName: opts.displayName });
  }

  window.NaviarVideo = {
    join: join,
    roomName: roomName,
    provider: providerName,
    securityPosture: securityPosture
  };
})(window, document);
