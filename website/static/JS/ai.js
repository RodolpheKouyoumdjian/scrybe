async function aiOutput(pressedButton) {
    let output;
    const projectName = document.getElementById("hiddenProjectName").value;

    const generateButton = document.querySelector(
        `button[value="${pressedButton}"]`
    );
    console.log(generateButton);
    generateButton.innerHTML =
        '<i class="fa fa-spinner fa-spin" style="margin: 0px 10px;"></i>Generating';

    switch (pressedButton) {
        case "imageGenerate":
            const imageInput = document.getElementById("imageInput").value;

            $.ajax({
                type: "POST",
                data: {
                    projectName: projectName,
                    imageInput: imageInput,
                },
                url: "/_imageGenerator",
                success: function (response) {
                    if (response != "") {
                        document.getElementById(
                            "generatedImageContainer"
                        ).innerHTML = `
                            <div id="w-node-_0cdfc3e1-b742-ba9e-b896-1be8b409683a-41cbdc42">
                                <a id="generatedImageLinkContainer" target="_blank" 
                                    href=${response} download="my_beautiful_art.jpg">
                                    <img src=${response} id="generatedImage"
                                    loading="eager" alt="AI generated ${imageInput}"
                                    style="border-radius: 12px;">
                                </a>
                            </div>
                        `;
                    }
                    generateButton.innerHTML = "Generate";
                },
                error: function () {
                    generateButton.innerHTML = "Generate";
                },
            });

            break;

        case "emailGenerate":
            const emailType = document.getElementById("emailType").value;
            const emailContent = document.getElementById("emailContent").value;
            const emailTone = document.getElementById("emailTone").value;

            $.ajax({
                type: "POST",
                data: {
                    projectName: projectName,
                    emailType: emailType,
                    emailContent: emailContent,
                    emailTone: emailTone,
                },
                url: "/_emailWriter",
                success: function (response) {
                    if (response != "") {
                        renderAIOutput(pressedButton, response);
                    }
                    generateButton.innerHTML = "Generate";
                },
                error: function () {
                    generateButton.innerHTML = "Generate";
                },
            });
            break;

        case "socialMediaGenerate":
            const socialMediaPlatform = document.getElementById(
                "socialMediaPlatform"
            ).value;
            const socialMediaType =
                document.getElementById("socialMediaType").value;
            const socialMediaContent =
                document.getElementById("socialMediaContent").value;
            const socialMediaTone =
                document.getElementById("socialMediaTone").value;

            $.ajax({
                type: "POST",
                data: {
                    projectName: projectName,
                    socialMediaPlatform: socialMediaPlatform,
                    socialMediaType: socialMediaType,
                    socialMediaContent: socialMediaContent,
                    socialMediaTone: socialMediaTone,
                },
                url: "/_socialMediaWriter",
                success: function (response) {
                    if (response != "") {
                        renderAIOutput(pressedButton, response);
                    }
                    generateButton.innerHTML = "Generate";
                },
                error: function () {
                    generateButton.innerHTML = "Generate";
                },
            });
            break;

        case "articleGenerate":
            const articleType = document.getElementById("articleType").value;
            const articleContent =
                document.getElementById("articleContent").value;
            const articleTone = document.getElementById("articleTone").value;

            $.ajax({
                type: "POST",
                data: {
                    projectName: projectName,
                    articleType: articleType,
                    articleContent: articleContent,
                    articleTone: articleTone,
                },
                url: "/_articleWriter",
                success: function (response) {
                    if (response != "") {
                        renderAIOutput(pressedButton, response);
                    }
                    generateButton.innerHTML = "Generate";
                },
                error: function () {
                    generateButton.innerHTML = "Generate";
                },
            });
            break;

        case "customGenerate":
            const customInput = document.getElementById("customInput").value;

            $.ajax({
                type: "POST",
                data: {
                    projectName: projectName,
                    customInput: customInput,
                },
                url: "/_customWriter",
                success: function (response) {
                    if (response != "") {
                        renderAIOutput(pressedButton, response);
                    }
                    generateButton.innerHTML = "Generate";
                },
                error: function () {
                    generateButton.innerHTML = "Generate";
                },
            });
            break;

        default:
            break;
    }
}

function renderAIOutput(generateButtonName, textToRender) {
    const container = document.querySelector(
        `.generatedTextContainer${generateButtonName}`
    );

    textToRender = textToRender.trim().replace(/^\s+/, '');

    /*
        copy button:

        <div style="display: flex; justify-content: flex-end; hover: cursor">
                    <i id="copyButton" class="ri-file-copy-line" style="font-size: x-large;"></i>
                </div>
    */

    container.innerHTML = `
    <div class="module account" style="padding: 40px 50px;">
                
                <div class="text-400">
                    <span class="color-neutral-800" style="white-space: pre-line"> 
                        ${textToRender}
                    </span>
                </div>
            </div>
    `;
}
