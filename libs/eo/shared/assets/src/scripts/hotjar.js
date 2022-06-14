/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
window.hjSiteSettings = window.hjSiteSettings || {
  site_id: 3007556,
  r: 1.0,
  rec_value: 1.0,
  state_change_listen_mode: 'automatic',
  record: true,
  continuous_capture_enabled: true,
  recording_capture_keystrokes: true,
  anonymize_digits: true,
  anonymize_emails: true,
  suppress_all: false,
  suppress_text: false,
  suppress_location: false,
  user_attributes_enabled: false,
  legal_name: null,
  privacy_policy_url: null,
  deferred_page_contents: [
    {
      id: 28698213,
      targeting: [
        {
          component: 'url',
          match_operation: 'simple',
          pattern: 'https://energioprindelse.dk/',
          negate: false,
        },
        {
          component: 'device',
          match_operation: 'exact',
          pattern: 'desktop',
          negate: false,
        },
      ],
    },
    {
      id: 28698212,
      targeting: [
        {
          component: 'url',
          match_operation: 'simple',
          pattern: 'https://energioprindelse.dk/',
          negate: false,
        },
        {
          component: 'device',
          match_operation: 'exact',
          pattern: 'tablet',
          negate: false,
        },
      ],
    },
    {
      id: 28698211,
      targeting: [
        {
          component: 'url',
          match_operation: 'simple',
          pattern: 'https://energioprindelse.dk/',
          negate: false,
        },
        {
          component: 'device',
          match_operation: 'exact',
          pattern: 'phone',
          negate: false,
        },
      ],
    },
  ],
  record_targeting_rules: [],
  feedback_widgets: [],
  heatmaps: [
    {
      id: 9098928,
      created_epoch_time: 1654593080,
      targeting: [
        {
          component: 'url',
          match_operation: 'simple',
          pattern: 'https://energioprindelse.dk/',
          negate: false,
        },
      ],
      selector_version: 2,
      capture_type: 'SNAPSHOT_1000',
    },
  ],
  polls: [],
  integrations: {
    optimizely: { tag_recordings: false },
    google_optimize: { tag_recordings: true },
  },
  features: [
    'client_script.safe_date',
    'feedback.widgetV2',
    'heatmap.continuous_capture',
    'settings.billing_v2',
    'survey.impressions',
  ],
};

!(function (e) {
  var t = {};
  function n(o) {
    if (t[o]) return t[o].exports;
    var a = (t[o] = { i: o, l: !1, exports: {} });
    return e[o].call(a.exports, a, a.exports, n), (a.l = !0), a.exports;
  }
  (n.m = e),
    (n.c = t),
    (n.d = function (e, t, o) {
      n.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: o });
    }),
    (n.r = function (e) {
      'undefined' != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }),
        Object.defineProperty(e, '__esModule', { value: !0 });
    }),
    (n.t = function (e, t) {
      if ((1 & t && (e = n(e)), 8 & t)) return e;
      if (4 & t && 'object' == typeof e && e && e.__esModule) return e;
      var o = Object.create(null);
      if (
        (n.r(o),
        Object.defineProperty(o, 'default', { enumerable: !0, value: e }),
        2 & t && 'string' != typeof e)
      )
        for (var a in e)
          n.d(
            o,
            a,
            function (t) {
              return e[t];
            }.bind(null, a)
          );
      return o;
    }),
    (n.n = function (e) {
      var t =
        e && e.__esModule
          ? function () {
              return e.default;
            }
          : function () {
              return e;
            };
      return n.d(t, 'a', t), t;
    }),
    (n.o = function (e, t) {
      return Object.prototype.hasOwnProperty.call(e, t);
    }),
    (n.p = ''),
    n((n.s = 339));
})({
  339: function (e, t) {
    (window.hjBootstrap =
      window.hjBootstrap ||
      function (e, t, n) {
        var o = [
            'bot',
            'google',
            'headless',
            'baidu',
            'bing',
            'msn',
            'duckduckbot',
            'teoma',
            'slurp',
            'yandex',
            'phantomjs',
            'pingdom',
            'ahrefsbot',
          ].join('|'),
          a = new RegExp(o, 'i'),
          i = window.navigator || { userAgent: 'unknown' },
          r = i.userAgent ? i.userAgent : 'unknown';
        if (a.test(r))
          console.warn('Hotjar not launching due to suspicious userAgent:', r);
        else {
          var s = 'http:' === window.location.protocol,
            d = Boolean(window._hjSettings.preview);
          if (!s || d) {
            var l = function (e, t, n) {
              (window.hjBootstrapCalled = (
                window.hjBootstrapCalled || []
              ).concat(n)),
                window.hj &&
                  window.hj._init &&
                  window.hj._init._verifyInstallation &&
                  hj._init._verifyInstallation();
            };
            l(0, 0, n);
            var p,
              _,
              c,
              u,
              h = window.document,
              j = h.head || h.getElementsByTagName('head')[0];
            h.addEventListener &&
              ((hj.scriptDomain = e),
              ((p = h.createElement('script')).async = 1),
              (p.src = hj.scriptDomain + t),
              (p.charset = 'utf-8'),
              j.appendChild(p),
              (u = [
                'iframe#_hjRemoteVarsFrame {',
                'display: none !important; width: 1px !important; height: 1px !important; opacity: 0 !important; pointer-events: none !important;',
                '}',
              ]),
              ((_ = h.createElement('style')).type = 'text/css'),
              _.styleSheet
                ? (_.styleSheet.cssText = u.join(''))
                : _.appendChild(h.createTextNode(u.join(''))),
              j.appendChild(_),
              ((c = h.createElement('iframe')).style.cssText = u[1]),
              (c.name = '_hjRemoteVarsFrame'),
              (c.title = '_hjRemoteVarsFrame'),
              (c.id = '_hjRemoteVarsFrame'),
              (c.src =
                'https://' +
                (window._hjSettings.varsHost || 'vars.hotjar.com') +
                '/box-63c3a81830bf549dafe40b369003f751.html'),
              (c.onload = function () {
                (l.varsLoaded = !0),
                  'undefined' != typeof hj &&
                    hj.event &&
                    hj.event.signal &&
                    hj.event.signal('varsLoaded');
              }),
              (l.varsJar = c),
              'interactive' === h.readyState ||
              'complete' === h.readyState ||
              'loaded' === h.readyState
                ? f()
                : h.addEventListener('DOMContentLoaded', f),
              (l.revision = '81581d2536d9'),
              (window.hjBootstrap = l));
          } else
            console.warn(
              'For security reasons, Hotjar only works over HTTPS. Learn more: https://help.hotjar.com/hc/en-us/articles/115011624047'
            );
        }
        function f() {
          setTimeout(function () {
            h.body.appendChild(c);
          }, 50);
        }
      }),
      window.hjBootstrap(
        'https://script.hotjar.com/',
        'modules.b871a939666125f20d79.js',
        '3007556'
      ),
      (window.hjLazyModules = window.hjLazyModules || {
        SURVEY_V2: { js: 'survey-v2.b5b0852b8313e38683d8.js' },
        SURVEY_BOOTSTRAPPER: {
          js: 'survey-bootstrapper.73ff101f3f663998d1e6.js',
        },
        SURVEY_ISOLATED: { js: 'survey-isolated.4ed5aa759dbacab48998.js' },
        HEATMAP_SCREENSHOTTER: {
          js: 'heatmap-screenshotter.3dfd459ea2aa23e2e2a6.js',
        },
        HEATMAP_VIEWER: { js: 'heatmap-viewer.f49497835405cd5f9fea.js' },
        HEATMAP_DYNAMIC_VIEW: {
          js: 'heatmap-dynamic-view.80e50ebf7414e4678d9c.js',
        },
        SURVEY_INVITATION: { js: 'survey-invitation.e44c3d7ec4d0668673b4.js' },
        NOTIFICATION: { js: 'notification.e4b3b615773ddd177312.js' },
        INCOMING_FEEDBACK: { js: 'incoming-feedback.1ab9d9ea56f5134a747d.js' },
        PREACT_INCOMING_FEEDBACK: {
          js: 'preact-incoming-feedback.141867ad32763125a7ea.js',
        },
        SENTRY: { js: 'sentry.b6048a310c7253782e9d.js' },
      });
  },
});
