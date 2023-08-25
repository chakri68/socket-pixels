<h1 align="center">
  <br>
  <a href="https://github.com/chakri68/socket-pixels-server">Socket-Pixels-Server</a>
</h1>

<h4 align="center">Server that uses Web Sockets to create a room for r/place-esque canvas at <a href="https://github.com/chakri68/socket-pixels" target="_blank">Socket-Pixels</a></h4>

<p align="center">
  <a href="#details">Details</a> •
  <a href="#key-features">Key Features</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#related">Related</a> •
  <a href="#license">License</a>
</p>

## Details

This is a simple clone of the r/place canvas implemented in HTML, CSS, and JavaScript. The r/place canvas was a collaborative art project on Reddit that allowed users to place colored pixels on a large canvas. This clone project aims to recreate the canvas functionality and allow users to draw on a similar canvas.

## Key Features

- Custom color selection
  - Instead of the fixed 16 colors in r/place, select custom colors when creating a room. It's like a box of crayons (but better ofc)
- Custom timeouts
  - Set custom timeouts, restricting them on how long they'll have to wait between two pixel places.
- IP-based identification
  - Users are identified using their IP addresses so that timeouts can be implemented. Just to try and (hopefully) keep things under control.
- Custom grid sizes
  - Select custom grid sizes for the canvas.
- Local database
  - To keep things simple and make this server locally hostable, I used a database that stores data locally ([tindogb](http://www.tingodb.com/)) so that you don't have to worry about setting up a cloud database.

## How To Use

To clone and run this application, you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
$ git clone https://github.com/chakri68/socket-pixels-server

# Go into the repository
$ cd socket-pixels-server

# Install dependencies
$ yarn install

# Run the app
$ yarn start
```

> **Note**
> I recommend using yarn for faster downloads ([more](https://github.com/pnpm/benchmarks-of-javascript-package-managers))
> TingoDB code can be reused with MongoDB ([more](https://github.com/sergeyksv/tingodb#:~:text=the%20API%20is%20fully%20compatible%20with%20the%20MongoDB%20v1.4%20API.))

## Related

[Socket-Pixels](https://github.com/amitmerchant1990/markdownify-web) - Svelte Frontend for Socket-Pixels

## Support

<a href="https://liberapay.com/chakri68/donate"><img alt="Donate using Liberapay" src="https://liberapay.com/assets/widgets/donate.svg"></a>

## License

MIT

---
