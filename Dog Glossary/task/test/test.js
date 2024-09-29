import path from 'path';
import {correct, StageTest, wrong} from 'hs-test-web';

const pagePath = path.join(import.meta.url, '../../src/index.html');

global.browserOptions = {
    defaultViewport: {
        width: 1024,
        height: 768
    }
}

class Test extends StageTest {

    page = this.getPage(pagePath)

    tests = [this.page.execute(() => {
        // test #1
        // HELPERS-->
        // method to check if element with id exists
        this.elementExists = (id, nodeNames) => {
            const element = document.body.querySelector(id);
            if (!element) return true;
            else return (nodeNames && !nodeNames.includes(element.nodeName.toLowerCase()));
        };

        // method to check if element with id has right text
        this.elementHasText = (id, correctText) => {
            const element = document.body.querySelector(id);
            if (!element) return true;

            if (correctText) {
                return (element.innerText !== correctText);
            }

            return !element.innerText || element.innerText.trim().length === 0;
        };

        // check content only has one element
        this.checkContentLen = () => {
            const content = document.body.querySelector(this.content);
            if (content.children.length !== 1) return wrong("The content div should only have one element.");
        };

        // check img
        this.checkImg = (srcStartsWith) => {
            // check if img exists
            const img = document.body.querySelector("img");
            if (!img) return wrong("The image is not displayed after clicking the button.");

            // check if parent is in content
            const imgInContent = document.body.querySelector("#content > img");
            if (!imgInContent)
                return wrong("The image should be a child of the element with the selector of #content.");

            // check if img has src or starts with srcStartsWith
            const src = img.getAttribute("src");
            if (!src || !src.includes(srcStartsWith))
                return wrong("The image does not have a source or the source does not start correctly.");
        };

        // check if helpers still attached
        this.checkHelpers = () => {
            return true;
        }

        // CONSTANTS-->
        const theElement = "The element with the selector of";
        this.content = "#content";
        // <--CONSTANTS

        // MESSAGES-->
        this.missingIdMsg = (id) => {
            return `${theElement} "${id}" is missing in the body of the HTML document.`;
        };
        this.wrongTagMsg = (id, tag, tagAlt) => {
            if (tagAlt) return `${theElement} "${id}" should be a/an ${tag} or ${tagAlt} tag.`;
            else return `${theElement} "${id}" should be a/an ${tag} tag.`;
        };
        this.wrongTextMsg = (id, text) => {
            return `${theElement} "${id}" should have the text: "${text}".`;
        };
        // <--MESSAGES
        return correct();

    }), this.page.execute(() => {
        // test #2
        // STAGE1 TAGS

        // check if h1 exists
        const h1 = "h1";
        if (this.elementExists(h1)) return wrong(this.missingIdMsg(h1));

        // check if correct text
        const h1Text = "Dog Glossary";
        if (this.elementHasText(h1, h1Text)) return wrong(this.wrongTextMsg(h1, h1Text));

        // check if  #button-random-dog exists
        const buttonRandom = "#button-random-dog";
        if (this.elementExists(buttonRandom)) return wrong(this.missingIdMsg(buttonRandom));

        // check if its button
        if (this.elementExists(buttonRandom, ["button"])) return wrong(this.wrongTagMsg(buttonRandom, "button"));

        // check if it has text
        const buttonText = "Show Random Dog";
        if (this.elementHasText(buttonRandom, buttonText))
            return wrong(this.wrongTextMsg(buttonRandom, buttonText));

        // check if content exists
        if (this.elementExists(this.content)) return wrong(this.missingIdMsg(this.content));

        // check if its div
        if (this.elementExists(this.content, ["div"])) return wrong(this.wrongTagMsg(this.content, "div"));

        return correct();
    }),
        this.node.execute(async () => {
            const reloadDetectedMsg = "Looks like the page was reloaded. Please prevent the page from reloading."

            // test #3
            // check button click and img after click
            const buttonRandom = "#button-random-dog";
            const button = await this.page.findBySelector(buttonRandom);
            const isEventFired = button.waitForEvent('click', 1000);
            await button.click();

            if (await !isEventFired) return wrong(`Expected click event on button with ${buttonRandom} id!`);

            await new Promise((resolve => {
                setTimeout(() => {
                    resolve();
                }, 3000)
            }));

            // check if page was reloaded
            try {
                await this.page.evaluate(() => {
                    return this.checkHelpers();
                })
            } catch (e) {
                return wrong(reloadDetectedMsg);
            }

            // check img
            await this.page.evaluate(() => {
                const srcStart = "https://images.dog.ceo/breeds";
                return this.checkImg(srcStart);
            });


            await button.click();

            await new Promise((resolve => {
                setTimeout(() => {
                    resolve();
                }, 3000)
            }));


            // check content only has one element
            await this.page.evaluate(() => {
                return this.checkContentLen();
            });

            // check img
            await this.page.evaluate(() => {
                const srcStart = "https://images.dog.ceo/breeds";
                return this.checkImg(srcStart);
            });

            return correct();

        }),
    ]

}

it("Test stage", async () => {
    await new Test().runTests()
}).timeout(30000);