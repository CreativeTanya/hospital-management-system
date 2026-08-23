const dns = require("dns");

dns.setServers([
  "8.8.8.8",
  "1.1.1.1"
]);

dns.resolveSrv(
  "_mongodb._tcp.medicare-cluster.dosdqmr.mongodb.net",
  (error, addresses) => {
    if (error) {
      console.error("DNS failed:", error);
      return;
    }

    console.log("DNS working successfully:");
    console.log(addresses);
  }
);