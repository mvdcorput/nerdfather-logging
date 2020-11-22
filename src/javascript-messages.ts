import { IMessage } from "./background/messages.service";

chrome.runtime.sendMessage({
    method: 'getMessages',
    data: null
}, function(response) {
    if (response.messages && response.messages.length)
    {
        let docContent = '';

        // Sort by date desc
        const messages: IMessage[] = response.messages.sort(function(a, b){
            return b.date - a.date;
        });

        // Add to end of body
        document.getElementsByTagName('body')[0].insertAdjacentHTML('beforeend', `
            <p>
            Url : ${response.url}
            </p>
            <br/>
        `);

        // Create log message html
        messages.forEach(m => {
            const type = m.data.message ? 'Log' : m.data.error ? 'Error' : 'Warning';
            const url = type === 'Log' ? m.data.message.url : type === 'Error' ? m.data.error.url : m.data.warning.url;
            const text = type === 'Log' ? m.data.message.text : type === 'Error' ?
                m.data.error.is404 ? '404 Resource not found' : m.data.error.text :
                m.data.warning.text;
            const stack = type === 'Log' ? '' : type === 'Error' ? m.data.error.stack : m.data.warning.stack;
            const className = type.toLowerCase();

            docContent = docContent.concat(`<b><p>${m.date} : <span class="${className}">${type}</span> (${url})</b><br/>${text}<br/>${stack}<br/></p><br/>`);
        });

        // Add to end of body
        document.getElementsByTagName('body')[0]
                .insertAdjacentHTML('beforeend', docContent);
    }
});

