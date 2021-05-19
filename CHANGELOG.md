# Changelog

## [2.0.3] - 2021-05-17
### Changes
- Added back backwards compatibility for Node 7

## [2.0.2] - 2021-05-12
### Changes
- This patch release fixes a security issue that allowed a malicious actor to trick the middleware into redirecting to other domains. In this new release the middleware will only remove a trailing slash from the path if the resulting Location-header will still redirect the user to the same domain he was originally requesting. The vulnerability and attack vector is described in greater detail in  [CVE-2021-23384](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-23384). Big thank you goes out to [@apple502j](https://github.com/apple502j) for discovering and disclosing this vulnerability to us.
- Breaks backwards compatibility for Node 7
