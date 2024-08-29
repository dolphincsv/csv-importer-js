export const ErrorMessages = {
  // noAuthentication: "Please provide an authentication parameter either by passing in { clientId: 'MY_CLIENT_ID' } or { jwt: 'xxx' }. Read more: [link]",
  noMode: 'Please define the mode property. Available values are demo, development, and production. Refer to https://docs.dolphincsv.com/get-started/embed-importer for more details.',
  noTemplateKey: 'Please provide a template key. You can get your template key via the DolphinCSV dashboard at https://dolphincsv.com/app.',
  noColumns: 'Please provide a columns argument. Read more about how to configure columns at https://docs.dolphincsv.com/configuring-columns.',
  // clientIdWarning: 'Warning: Using client ID authentication means anyone with access to the client ID can send data to your importer. Since the client ID is exposed in the browser, if the client ID is leaked, an attacker can use that client ID to send arbitrary data to your importer. If you are displaying user uploaded data somewhere else in your application, please ensure all incoming data is sanitized & escaped properly by your application, or use JWT authentication instead. Read more here: [Link]',
  launchFailed: 'DolphinCSV importer has failed to initialize',
  iFrameEmpty: 'iFrame contentWindow is null and the iframe has never been closed'
}
