// ==UserScript==
// @name         Return Youtube Layout
// @namespace    http://github.com/rztprog
// @version      0.3
// @description  Disable the experimental Youtube 'Porn Layout' features for a more comfortable viewing experience.
// @author       Rztprog
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// ==/UserScript==

// HELP ME TO IMPROVE THIS SCRIPT !!
// HELP ME TO IMPROVE THIS SCRIPT !!
// HELP ME TO IMPROVE THIS SCRIPT !!

(function() {
    'use strict';

    // Variables
    let timer = null;
    let observersActive = false;
    let observers = [];
    const experimentFlags = yt.config_.EXPERIMENT_FLAGS;
    /*
    const targetedElements = [
        "thumbnail-container",
        "thumbnail",
        "label-container",
        "ytp-inline-preview-scrim",
        "metadata",
        "metadata-line",
        "yt-core-image",
        "video-title",
        "ytd-video-meta-block",
        "ytd-video-renderer",
        "ytd-rich-grid-media",
        "ytd-rich-item-rendere",
        "ytd-video-preview",
        "ytd-moving-thumbnail-renderer",
        "ytd-miniplayer",
        "ytp-size-button",
        "ytp-miniplayer-expand-watch-page-button",
        "ytp-miniplayer-scrim",
        "ytp-play-button",
    ];
    */

    // ExperimentFlags Variables
    experimentFlags.kevlar_watch_grid = false;
    experimentFlags.small_avatars_for_comments = false;
    experimentFlags.small_avatars_for_comments_ep = false;

    // EventListeners
    document.addEventListener('click', (event) => {
        resizeYoutubeWatch();
    }, true);

    // Functions
    function resizeYoutubeWatch() {
        let counter = 0;

        const findYoutubeWatch = () => {
            counter++;
            if (window.location.href.includes('youtube.com/watch')) {
                clearInterval(timer2);
                console.log("RYL Loaded");
                // modifyPageElements();
                const primary = document.querySelector('#columns #primary');
                const moviePlayer = document.querySelector('#movie_player');
                const mainVideo = document.querySelector('.html5-main-video');
                const playerContainerOuter = document.querySelector('#player-container-outer');
                const ytpChromeBottom = document.querySelector('.ytp-chrome-bottom');

                setElementSize(primary, 'max-width', 'fit-content', false);
                setElementSize(playerContainerOuter, 'max-width', 100, '%');
                waitForElement('#items .ytd-watch-next-secondary-results-renderer #contents', 'padding-top', 0, 'px', false, false);

                if (!observersActive) {
                    observers.push(observerAndSetSize(primary, 'max-width', 'fit-content', false, false, false));
                    observers.push(observerAndSetSize(playerContainerOuter, 'max-width', 100, '%', false, false));
                    observers.push(observerAndSetSize(moviePlayer, '', 0, 'px', mainVideo, "width"));
                    observers.push(observerAndSetSize(moviePlayer, '', 0, 'px', mainVideo, "height"));
                    observers.push(observerAndSetSize(moviePlayer, '', 15, 'px', ytpChromeBottom, "width"));

                    observers.push(observerAndSetSize(mainVideo, "left", 0, "px"));
                    observersActive = true;
                }
            } else if (counter > 50) {
                clearInterval(timer2);
                observers.forEach(observer => {
                    if (observer) {
                        observer.disconnect();
                    }
                });
                observers = [];
                observersActive = false;
            }
        }

        const timer2 = setInterval(findYoutubeWatch, 100);
    }

    function observerAndSetSize(element, style, value, unit, elementToChange, elementToChangeStyle) {
        let observer = new MutationObserver(function(mutationsList, observer) {
            if (elementToChange) {
                const newValue = elementToChangeStyle == "width" ? element.offsetWidth : element.offsetHeight;
                setElementSize(elementToChange, elementToChangeStyle, newValue - value, unit);
            } else {
                setElementSize(element, style, value, unit);
            }
        });

        observer.observe(element, { attributes: true });
    }

    function waitForElement(selector, style, value, unit, elementToChange, elementToChangeStyle) {
        const elementIsDisplayed = () => {
            const element = document.querySelector(selector);

            if (element !== null) {
                clearInterval(timer2);
                // const newValue = elementToChangeStyle == "width" ? element.offsetWidth : element.offsetHeight;
                setElementSize(element, style, value, unit);

                if (!observersActive) {
                    observers.push(observerAndSetSize(element, style, value, unit, false, false));
                }
            }
        }

        const timer2 = setInterval(elementIsDisplayed, 50);
    }

    function setElementSize(element, style, value, unit) {
        if (style == 'max-width') {
            element.style.maxWidth = `${value}${unit ? unit : ""}`;
        }

        if (style == "width") {
            element.style.width = `${value}${unit ? unit : ""}`;
        }

        if (style == "height") {
            element.style.height = `${value}${unit ? unit : ""}`;
        }

        if (style == "left") {
            element.style.left = `${value}${unit ? unit : ""}`;
        }

        if (style == "padding-top") {
            element.style.paddingTop = `${value}${unit ? unit : ""}`;
        }
    }

    /*
    function checkIfTargetedElements(element) {
        for (const target of targetedElements) {
            if (element.id === target || element.classList.contains(target)) {
                return true;
            }
        }

        return false;
    }
    */

    /*
    function removeElementByXPath(xpath) {
        var element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (element) {
            element.parentNode.removeChild(element);
        }
    }

    function moveElementById(sourceId, targetId) {
        var sourceElement = document.getElementById(sourceId);
        var targetElement = document.getElementById(targetId);
        if (sourceElement && targetElement) {
            targetElement.appendChild(sourceElement);
        }
    }

    function removeAvatarLinks() {
        var avatarLinks = document.querySelectorAll('a#avatar-link');
        avatarLinks.forEach(function(link) {
            link.parentNode.removeChild(link);
        });
    }

    function modifyThumbnailDivs() {
        var thumbnailDivs = document.querySelectorAll('div#thumbnail');
        thumbnailDivs.forEach(function(div) {
            div.removeAttribute("class");
            div.setAttribute("style", "width:167px;position:absolute;");
        });
    }

    function modifyDetailsDivs() {
        var detailsDivs = document.querySelectorAll('div#details');
        detailsDivs.forEach(function(div) {
            div.setAttribute("style", "padding-left:173px;margin-top:-20px;");
        });
    }

    function modifyContentDivs() {
        var contentDivs = document.querySelectorAll('div#content');
        contentDivs.forEach(function(div) {

        });
    }

    function modifyMarginTopByXPath(xpath, marginTopValue) {
        var element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (element) {
            element.setAttribute("style", "margin-top: " + marginTopValue);
        }
    }

    function removeParagraphsWithNew() {
        var paragraphs = document.querySelectorAll('p');
        paragraphs.forEach(function(paragraph) {
            if (paragraph.textContent.trim() === 'New') {
                paragraph.parentNode.removeChild(paragraph);
            }
        });
    }

    function clickExpandButton() {
        var expandButton = document.evaluate("/html/body/ytd-app/div[1]/ytd-page-manager/ytd-watch-grid/div[5]/div[2]/div/ytd-playlist-panel-renderer/div/div[1]/div/div[1]/yt-icon-button/button", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (expandButton && expandButton.getAttribute("aria-label") === "Expand") {
            expandButton.click();
        }
    }

    function modifyPageElements() {
        removeElementByXPath("/html/body/ytd-app/div[1]/ytd-page-manager/ytd-watch-grid/div[5]/div[1]/div/div[2]/div/ytd-watch-next-secondary-results-renderer/div[2]/ytd-rich-grid-renderer/div[1]");
        moveElementById("secondary-inner", "bottom-grid");
        removeAvatarLinks();
        modifyThumbnailDivs();
        modifyDetailsDivs();
        modifyContentDivs();
        removeParagraphsWithNew();
        modifyMarginTopByXPath("/html/body/ytd-app/div[1]/ytd-page-manager/ytd-watch-grid/div[5]/div[2]/ytd-watch-next-secondary-results-renderer/div[2]/ytd-rich-grid-renderer/div[5]", "-20px");

        /* Video Description Container
    var bottomRow = document.getElementById("bottom-row");
    if (bottomRow) {
        bottomRow.setAttribute("style", "margin-top: -10px; padding-bottom: 5px;");
        var descriptionInner = document.getElementById("description-inner");
        if (descriptionInner) {
            descriptionInner.insertBefore(bottomRow, descriptionInner.firstChild);
        }
    }
    */

        /* Description
    var aboveTheFold = document.getElementById("above-the-fold");
    if (aboveTheFold) {
        aboveTheFold.setAttribute("style", "padding-top: 10px;");
    }
    */

        /* Secondary */
    /*
        const secondaryInner = document.getElementById("secondary-inner");
        if (secondaryInner) {
            secondaryInner.removeAttribute("class");
        }


        const sourceElement = document.evaluate("/html/body/ytd-app/div[1]/ytd-page-manager/ytd-watch-grid/div[5]/div[1]/div/div[2]/div/ytd-watch-next-secondary-results-renderer", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        const targetElement = document.evaluate("/html/body/ytd-app/div[1]/ytd-page-manager/ytd-watch-grid/div[5]/div[2]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (sourceElement && targetElement) {
            targetElement.appendChild(sourceElement);
        }

        let urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('list') && urlParams.get('list') === 'WL') {
            removeElementByXPath("/html/body/ytd-app/div[1]/ytd-page-manager/ytd-watch-grid/div[5]/div[2]/ytd-watch-next-secondary-results-renderer/div[2]/ytd-rich-grid-renderer/div[5]");
            clickExpandButton();
        }

        const channelNameTags = document.querySelectorAll('ytd-channel-name#channel-name');
        channelNameTags.forEach(function(tag) {
            tag.style.zIndex = "1";
        });
    }
*/
})();
