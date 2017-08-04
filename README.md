# DOC-HUNT
A website that helps Seattle-ites find a doctor by aliment.  Uses data from the [betterDoctor API](https://developer.betterdoctor.com/documentation15#/).

## Prerequisites
* Node.js & Bower are installed.
* You must also have a user_key for the betterDoctor API.  You can get that [here](https://developer.betterdoctor.com/)

## Instructions
1. Clone the repository
2. Run `npm install` & `bower install`
3. Create a file called .env in the repository root folder. Add this text, and include your user_key
```
exports.apiKey = "<YOUR USER_KEY HERE>";
```
4. Run `gulp serve`

Direct questions and comments to: [github@zaske.com](mailto:github@zaske.com)

## Technologies Used
* JavaScript
* Node.js
* jQuery
* Bootstrap
* Google Fonts
* Gulp
* Bower
* Sass

### License
Copyright (c) 2017 Steve Zaske

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
