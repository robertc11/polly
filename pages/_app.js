import '../styles/globals.css'
import { SWRConfig } from 'swr'
import fetchJson from '../lib/fetchJson'



function MyApp({ Component, pageProps }) {
  return (
    <SWRConfig
      value={{
        fetcher: fetchJson,
        onError: (err) => {
          console.log(err)
        },
      }}
    >
      <Component {...pageProps} />
    </SWRConfig>
  )
}

process.env.SERVER_PID = process.pid;
console.error("[INFO] PID: " + process.pid);

// httpsServer.listen(PORT, () => {
//   console.log("HTTPS Server running on port 3000");
// });


// process.on("SIGTERM", (stream) => {
//   httpsServer.close();
//   console.log("HTTPS Server closed port 3000 gracefully.");
//   process.exit(0);
// });

export default MyApp
