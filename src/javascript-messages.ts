chrome.runtime.sendMessage({
    method: 'getMessages',
    data: null
}, function(response) {
    if (response.messages)
    {
        let docContent = '';

        // Sort by date desc
        response.messages = response.messages.sort(function(a, b){
            return b.date - a.date;
        });

        // Create log message html
        response.messages.forEach(m => {
            const type = m.data.error ? 'Error' : 'Warning';
            const url = type === 'Error' ? m.data.error.url : m.data.warning.url;
            const text = type === 'Error' ?
                m.data.error.is404 ? '404 Resource not found' : m.data.error.text :
                m.data.warning.text;
            const stack = type === 'Error' ? m.data.error.stack : m.data.warning.stack;
            const className = type.toLowerCase();
            docContent = docContent.concat(`<b><p>${m.date} : <span class="${className}">${type}</span> (${url})</b>\n${text}\n${stack}\n</p><br/>`);
        });

        // Add to end of body
        document.getElementsByTagName('body')[0]
                .insertAdjacentHTML('beforeend', docContent);

    }
});

