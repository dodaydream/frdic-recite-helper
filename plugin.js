// ==UserScript==
// @name         FrdicReciteLex
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Stanley Cao
// @match        https://www.frdic.com/areas/recite/fr/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

const fadeInKeyframes = [
    { opacity: 0 },
    { opacity: 0 },
    { opacity: 0 },
    { opacity: 1 }
];

(function() {
    'use strict';

    const BTN = 'div.exam-container div.options-container button';
    const WORD = '.explain-title'

    let currentWord = ''
    let currentWordElem = null
    let handler = null;

    // periodically check existence of button
    setInterval(async () => {

        let elem = document.querySelectorAll(WORD);

        if (elem.length == 0) return

        currentWordElem = elem[0]

        if (currentWord == currentWordElem.innerText) return

        clearTimeout(handler);

        currentWord = currentWordElem.innerText

        currentWordElem.animate(fadeInKeyframes, {
            duration: 6000, // Animation duration in milliseconds
            fill: 'forwards' // Keeps the final state of the animation
        });


        const newElem = document.createElement('span')
        newElem.innerText = '--'
        currentWordElem.parentNode.insertBefore(newElem, currentWordElem.nextSibling)

        newElem.animate(fadeInKeyframes, {
            duration: 6000, // Animation duration in milliseconds
            fill: 'forwards' // Keeps the final state of the animation
        });


        const response = await fetch("http://localhost:3000/search?q=" + currentWord)

        const data = await response.text();

        const parsed = data.split('\n').map((d) => d.split('\t'));

        const ques = document.querySelectorAll('.card-question');

        if (ques.length != 0) {
            ques[0].innerText = parsed[0][27]
        }

        newElem.innerText = parsed[0][27]

        const pos = parsed[0][3]

        if (pos == 'NOM' || pos == 'VER') {
            const imgResponse = await fetch("http://localhost:3000/images?q=" + currentWord)

            const images = await imgResponse.json();

            const previewContainer = document.createElement('div')
            previewContainer.style.display = 'flex';
            previewContainer.style.alignItems = 'center';
            previewContainer.style.overflow = 'auto';

            images.forEach((preview) => {
                const image = new Image();
                image.src = preview.preview.url;
                image.style.width = '33%'
                image.alt = preview.origin.title;
                image.title = preview.origin.title;
                previewContainer.appendChild(image);
            });

            currentWordElem.parentNode.insertBefore(previewContainer, newElem.nextSibling)
        }


        console.log(parsed[0][27])

        handler = setTimeout(() => {
            // currentWordElem.style.background = 'unset'
           //  newElem.innerText = parsed[0][27]
        }, 5000)

    }, 200)
})();
