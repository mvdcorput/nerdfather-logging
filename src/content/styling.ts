export class Styling {
  public addThemeStyleToHead = (css: string) => {
    const head = this.removeThemeStyleFromHead();
    const style = document.createElement("style");

    style.setAttribute("data-owner", "bd");
    style.type = "text/css";
    style.appendChild(document.createTextNode(css));

    head.appendChild(style);
  };

  private removeThemeStyleFromHead = (): HTMLHeadElement => {
    const head = document.getElementsByTagName("head")[0];
    const headNodes = head.childNodes;
    let themeStyleNode: Element = null;

    for (let i = 0; i < headNodes.length; i++) {
      if (headNodes[i].nodeType == 1) {
        const dataOwnerAttribute = (headNodes[i] as Element).attributes[
          "data-owner"
        ];
        if (dataOwnerAttribute && dataOwnerAttribute.value == "cs") {
          themeStyleNode = headNodes[i] as Element;
        }
      }
    }
    if (themeStyleNode !== null) {
      head.removeChild(themeStyleNode);
    }

    return head;
  };
}
