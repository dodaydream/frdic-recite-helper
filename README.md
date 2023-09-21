# Frdic Recite Helper

This is a helper project for [Frdic Recite](https://www.frdic.com/recite/online), adding support for syllable segmentation and relevant images to help memorize French words.

![Screenshot](./screenshots/helper.png)

## Getting Start

This project contains two parts, the backend and the Tampermonkey script. To get started, clone this repo first.

```bash
git clone https://github.com/dodaydream/frdic-recite-helper
```

Then install the dependencies

```bash
yarn install
```

Import the [Lexique](http://www.lexique.org/) dataset to get syllable segmentation, you can download it from [here](http://www.lexique.org/databases/Lexique383/Lexique383.zip). After finishing the download, extract and place `Lexique383.tsv` inside the `lexique` directory.


Start the backend service

```bash
node server.js
```

Finally, install the Tampermonkey script, and then you are good to go.

Bonne chance!

## Acknowledgement

[Lexique](http://www.lexique.org)

[googlethis](https://www.npmjs.com/package/googlethis)

[etymologeek](https://etymologeek.com/)

## License

[MIT license](https://opensource.org/licenses/MIT).
