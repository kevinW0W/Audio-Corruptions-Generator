# Local HTTPS server

From the project folder, run:

```powershell
python serve_https.py
```

The app will be available at `https://localhost:8080/audio-corruptions.html`.
The server listens on all network interfaces, so you can also use your
computer's LAN IP with port `8080` from another device.

This project-local certificate is self-signed. A browser will warn until the
certificate is trusted on that device. For a phone/tablet, install and trust
`PWA/local-dev-cert.cer` using that operating system's certificate settings,
then open the LAN URL. On iPhone, install the downloaded certificate profile,
then enable it under Settings > General > About > Certificate Trust Settings.
The certificate includes this computer's current LAN IP; regenerate it if that
address changes. `localhost` works on the computer running the server.
