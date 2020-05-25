
export class StorageDb
{
    constructor() {
        this.getMarkedUrls();
    }

    public getMarkedUrls(): Array<string> {
        let markedUrls = JSON.parse(localStorage.getItem('marked-urls'));

        if (!markedUrls || !markedUrls.length)
        {
            this.setMarkedUrls([]);

            markedUrls = [];
        }   

        return markedUrls;
    }

    public isMarked(url: string): boolean {
        const markedUrls = this.getMarkedUrls();

        return markedUrls.filter((u) => { return u === url}).length > 0;
    }

    public mark(url: string) {
        const markedUrls = this.getMarkedUrls();

        if (markedUrls.filter((u) => { return u === url}).length === 0)
        {
            markedUrls.push(url);

            this.setMarkedUrls(markedUrls);
        }
    }

    public purge() {
        this.setMarkedUrls([]);
    }

    public unmark(url: string) {
        let markedUrls = this.getMarkedUrls();

        if (markedUrls.filter((u) => { return u === url}).length > 0)
        {
            markedUrls = markedUrls.filter((u) => { return u !== url });

            this.setMarkedUrls(markedUrls);
        }
    }

    private setMarkedUrls(markedUrls: Array<string>)
    {
        localStorage.setItem('marked-urls', JSON.stringify(markedUrls));
    }
}