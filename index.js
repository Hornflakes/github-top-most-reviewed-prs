const apiUrl = process.env.API_URL;
const owner = process.env.OWNER;
const repo = process.env.REPO;
const pat = process.env.PAT;
const headers = {
    Authorization: `token ${pat}`,
};

const fetchAllPrs = async (url) => {
    let prs = [];
    let next = true;
    let pageUrl = url;

    while (next) {
        const res = await fetch(pageUrl, { headers });
        if (!res.ok) {
            throw new Error(`request error!, status: ${res.status}`);
        }

        const pagePrs = await res.json();
        prs = prs.concat(pagePrs);

        const linkHeader = res.headers.get('link');
        const matches = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
        next = matches;
        pageUrl = matches && matches[1];
    }
    return prs;
};

const fetchReviewCommentsCount = async (url) => {
    const res = await fetch(url, { headers });
    if (!res.ok) {
        throw new Error(`request error!, status: ${res.status}`);
    }

    const comments = await res.json();
    return comments.length;
};

const getTopMostReviewedPrs = async (topCount = 10) => {
    const topMostReviewedPrs = [];

    try {
        const prsUrl = `${apiUrl}/repos/${owner}/${repo}/pulls?state=all&per_page=100`;
        const prs = await fetchAllPrs(prsUrl);

        for (const pr of prs) {
            const commentsCount = await fetchReviewCommentsCount(pr.review_comments_url);
            console.log(commentsCount);

            topMostReviewedPrs.push({
                number: pr.number,
                user: pr.user.login,
                url: pr.html_url,
                commentsCount,
            });
            topMostReviewedPrs.sort((a, b) => b.commentsCount - a.commentsCount);
            if (topMostReviewedPrs.length > topCount) {
                topMostReviewedPrs.pop();
            }
        }

        console.log(`Top ${topCount} most reviewed PRs in ${owner}/${repo}:`);
        topMostReviewedPrs.forEach((pr, i) => {
            console.log(
                `${i + 1}. #${pr.number} by ${pr.user} - ${pr.commentsCount} comments @ \x1b[34m${pr.url}\x1b[0m`
            );
        });
    } catch (error) {
        console.error(error);
    }
};

const args = process.argv.slice(2);
getTopMostReviewedPrs(args[0]);
