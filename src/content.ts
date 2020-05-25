import * as $ from 'jquery';
import { Styling } from './content/styling';
import { StorageDb } from './common/storage-db';

const stylingService = new Styling();
const storageDb = new StorageDb();

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.text === 'add-markers') {
        const searchEngine: SupportedSearchEngine = msg.searchEngine;

        stylingService.addThemeStyleToHead(getCss(searchEngine.cssForPositioning));

        $('<span class="cs-marker"></span>').insertBefore(searchEngine.searchResultSelector);

        const markers = $('.cs-marker');
        const markedUrls = storageDb.getMarkedUrls();
        for (let i = 0; i < markers.length; i++)
        {
            const url = $(markers[i]).next('a').attr('href');

            if (markedUrls.indexOf(url) >- 1) {
                $(markers[i]).addClass('marked');
            }
        }

        $('.cs-marker').off('click');
        $('.cs-marker').on('click', function(event) {
            const url = $(this).next('a').attr('href');

            if (storageDb.isMarked(url))
            {
                storageDb.unmark(url);
                $(this).removeClass('marked');
            }
            else 
            {
                storageDb.mark(url);
                $(this).addClass('marked');
            }

            event.stopPropagation();
        });         

        sendResponse(null);
    }

    if (msg.text === 'remove-markers') {
        storageDb.purge();
        $('.cs-marker').removeClass('marked');
        
        sendResponse(null);
    }    
});


function getCss(cssForPositioning: string): string
{
    return `
        .cs-marker {
            color: #dddddd !important;
        }

        .cs-marker.marked {
            color: #dd0000 !important;
        }

        .cs-marker:before {
            content: "\\2605";
            ${cssForPositioning}
        }'

        .cs-marker:hover:before {
            color: #dd0000;
            cursor: pointer;
        }
    `;
}


