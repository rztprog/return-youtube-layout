// ==UserScript==
// @name         Return Youtube Layout
// @namespace    http://github.com/rztprog
// @version      0.5
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

    // ExperimentFlags Variables
    experimentFlags.kevlar_watch_grid = false;
    experimentFlags.small_avatars_for_comments = false;
    experimentFlags.small_avatars_for_comments_ep = false;
    experimentFlags.kevlar_watch_comments_panel_button = false;
    experimentFlags.kevlar_watch_comments_ep_disable_theater = true;
    experimentFlags.kevlar_watch_grid_hide_chips = false;
    experimentFlags.kevlar_watch_grid_reduced_top_margin_rich_grid = false;
    experimentFlags.optimal_reading_width_comments_ep = false;
    experimentFlags.swatcheroo_direct_use_rich_grid = false;
    experimentFlags.web_watch_compact_comments = false;
    experimentFlags.web_watch_compact_comments_header = false;
    experimentFlags.swatcheroo_rich_grid_delay = 0;
    experimentFlags.wn_grid_max_item_widt = 0;
    experimentFlags.wn_grid_min_item_width = 0;

    // EventListeners
    document.addEventListener('click', (event) => {
        resizeYoutubePlayer();
        modifySidebarVideos();
    }, true);

    // Functions
    function resizeYoutubePlayer() {
        let counter = 0;

        const findYoutubePlayer = () => {
            counter++;
            if (window.location.href.includes('youtube.com/watch')) {
                clearInterval(timer2);
                const primary = document.querySelector('#columns #primary');
                const moviePlayer = document.querySelector('#movie_player');
                const mainVideo = document.querySelector('.html5-main-video');
                const playerContainerOuter = document.querySelector('#player-container-outer');
                const ytpChromeBottom = document.querySelector('.ytp-chrome-bottom');
                const ytpHeatMapChapter = document.querySelector('.ytp-heat-map-chapter');
                const ytpChapterHoverContainer = document.querySelector('.ytp-chapter-hover-container');
                const ytpIvVideoContent = document.querySelector('.ytp-iv-video-content');

                if (!observersActive) {
                    modifySidebarVideos();
                    observers.push(observerAndSetSize(primary, 'max-width', 'calc((100vh - 56px - 24px - 136px )*( 16 / 9 ))', '', false, false));
                    observers.push(observerAndSetSize(primary, 'min-width', 'calc( 480px *( 16 / 9 ))', '', false, false));
                    observers.push(observerAndSetSize(playerContainerOuter, 'max-width', 'calc((100vh - 56px - 24px - 136px )*( 16 / 9 ))', '', false, false));
                    observers.push(observerAndSetSize(playerContainerOuter, 'min-width', 'calc( 480px *( 16 / 9 ))', '', false, false));
                    observers.push(observerAndSetSize(moviePlayer, '', 0, 'px', mainVideo, "width"));
                    observers.push(observerAndSetSize(moviePlayer, '', 0, 'px', mainVideo, "height"));
                    observers.push(observerAndSetSize(moviePlayer, '', 24, 'px', ytpChromeBottom, "width"));
                    observers.push(observerAndSetSize(mainVideo, "left", 0, "px"));

                    /*
                    if (waitForElements('#movie_player') && waitForElements('.ytp-heat-map-chapter') && waitForElements('.ytp-chapter-hover-container') && waitForElements('.ytp-iv-video-content')) {
                        observers.push(observerAndSetSize(moviePlayer, '', 0, 'px', ytpHeatMapChapter, "width"));
                        observers.push(observerAndSetSize(moviePlayer, '', 0, 'px', ytpChapterHoverContainer, "width"));
                        observers.push(observerAndSetSize(moviePlayer, '', 0, 'px', ytpIvVideoContent, "width"));
                        observers.push(observerAndSetSize(moviePlayer, '', 0, 'px', ytpIvVideoContent, "height"));
                    }
                    */

                    observersActive = true;
                }
            } else if (counter > 50) {
                clearInterval(timer2);
                modifySidebarVideos();
                observers.forEach(observer => {
                    if (observer) {
                        observer.disconnect();
                    }
                });
                observers = [];
                observersActive = false;
            }
        }

        const timer2 = setInterval(findYoutubePlayer, 100);
    }

    function observerAndSetSize(element, style, value, unit, elementToChange, elementToChangeStyle) {
        setElementSize(element, style, value, unit);

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

    /*
    function waitForElements(selector) {
        const elementDisplayed = () => {
            const element = document.querySelector(selector);

            if (element) {
                clearInterval(timer2);
                return true;
            }
        }

        const timer2 = setInterval(elementDisplayed, 50);
    }
    */

    function setElementSize(element, style, value, unit) {
        const newStyle = `${value}${unit ? unit : ""}`;

        switch (style) {
            case 'max-width':
                element.style.maxWidth = newStyle;
                break;
            case 'min-width':
                element.style.minWidth = newStyle;
                break;
            case 'width':
                element.style.width = newStyle;
                break;
            case 'height':
                element.style.height = newStyle;
                break;
            case 'left':
                element.style.left = newStyle;
                break;
            case 'padding-top':
                element.style.paddingTop = newStyle;
                break;
            default:
                // Handle unsupported style properties
                console.error(`Unsupported style property: ${style}`);
                break;
        }
    }

    // Help with Garbhj script (https://github.com/garbhj/revert-youtube-layout-UI-change)
    function modifySidebarVideos() {
        if (window.location.href.includes('youtube.com/watch')) {
            // Format thumbnails
            const thumbnailDivs = document.querySelectorAll('div#thumbnail');
            thumbnailDivs.forEach(function(div) {
                div.removeAttribute("class"); // Remove existing classes

                // Apply combined styles (168 pixels width, border radius doesn't work)
                div.style.cssText = `width: 168px; position: absolute; border-radius: 2px;`;
            });

            // Modify details div spacing: Optimal min spacing was 99px for me - adjust if neccesary
            const detailsDivs = document.querySelectorAll('div#details');
            // I just put min-height because one line titles messed up spacing for some reason
            detailsDivs.forEach(function(div) {
                div.style.cssText = "padding-left:176px; margin-top:-10px; min-height: 99px;";
            });

            // Remove margins from contentsDivs (containing both thumbnail and details) to improve spacing
            const contentsDivs = document.querySelectorAll('div#contents.ytd-rich-grid-row');
            contentsDivs.forEach(function(div) {
                div.style.cssText = "margin: 0px;";
            });

            // Sepecify rich-item-renderer div spacing (includes playlist and ad items as well) because it's quite big by default
            const richItemDivs = document.querySelectorAll("div#contents.ytd-rich-grid-row > ytd-rich-item-renderer");
            richItemDivs.forEach(function(div) {
                div.style.cssText = "margin-left: 0px; margin-right 0px; margin-bottom: 13px;";
            });

            // Remove channel avatar profile pics
            const avatarLinks = document.querySelectorAll("a#avatar-link");
            avatarLinks.forEach(function(link) {
                link.remove();
            });

            // Reformat text size and spacing (doesn't quite work yet)
            const metadataLineDivs = document.querySelectorAll("div#metadata-line");
            metadataLineDivs.forEach(function(div) {
                div.style.cssText = "font-size: 1.2rem; line-height: 1.8rem;";
            });

            // Removes weird gap at the top of secondary recommendations
            const secondaryDivs = document.querySelectorAll("div#secondary");
            secondaryDivs.forEach(function(div) {
                div.style.cssText = "padding-top: 0px;";
            });
        } else {
            // Revert modifications when not on a YouTube watch page
            const thumbnailDivs = document.querySelectorAll('div#thumbnail');
            thumbnailDivs.forEach(function(div) {
                div.style.cssText = '';
            });

            const detailsDivs = document.querySelectorAll('div#details');
            detailsDivs.forEach(function(div) {
                div.style.cssText = '';
            });

            const contentsDivs = document.querySelectorAll('div#contents.ytd-rich-grid-row');
            contentsDivs.forEach(function(div) {
                div.style.cssText = '';
            });

            const richItemDivs = document.querySelectorAll("div#contents.ytd-rich-grid-row > ytd-rich-item-renderer");
            richItemDivs.forEach(function(div) {
                div.style.cssText = '';
            });

            const avatarLinks = document.querySelectorAll("a#avatar-link");
            avatarLinks.forEach(function(link) {
                link.style.cssText = '';
            });

            const metadataLineDivs = document.querySelectorAll("div#metadata-line");
            metadataLineDivs.forEach(function(div) {
                div.style.cssText = '';
            });

            const secondaryDivs = document.querySelectorAll("div#secondary");
            secondaryDivs.forEach(function(div) {
                div.style.cssText = '';
            });
        }
    }

    const observer1 = new MutationObserver(modifySidebarVideos);
    observers.push(observer1.observe(document.body, { childList: true, subtree: true }));
})();
