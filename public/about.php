<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta property="og:url" content="https://openaccess.transparency.org.uk" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Health Atlas" />
    <meta property="og:description" content="Explore global health sector integrity issues and scandals on our interactive map" />
    <meta property="og:image" content="https://openaccess.transparency.org.uk/images/thumbnail.png" />
    <title>About</title>
    <link rel='shortcut icon' type='image/x-icon' href='/favicon.ico' />
    <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Quicksand:500" rel="stylesheet">
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

    <link rel="stylesheet" href="static/about.css">
</head>
<body>
    <?php include 'header.php' ?>

    <div id="app" class="aboutPage">    
      <div class="container">
        <div class="panel-group" id="accordion">
          <!-- BLOCK 1 -->
          <div class="panel panel-default">
            <div class="panel-heading">
              <h1 class="panel-title">
                <a data-toggle="collapse" data-parent="#accordion" href="#collapse1">1. ABOUT</a>
              </h1>
            </div>
            <div id="collapse1" class="panel-collapse collapse in">
              <div class="panel-body">
<p>This dashboard is an interactive map marking news stories about integrity in healthcare across the globe. We want you to explore what's happening worldwide and in your area using our filters. Our aim is simple - to show the scale and complexity of integrity issues in health and its many forms around the globe.</p>

<p>The tool brings together thousands of news stories about healthcare integrity, categorized by type and location. You can explore specific forms of integrity issues - from fraud and bribery to sexual exploitation and conflicts of interest. Each dot on the map represents a real case reported in the media, letting you see patterns and hotspots while diving into the details of individual stories.</p>

<p>We've designed this to be a starting point for understanding healthcare integrity in your region or globally. While we've gathered as much data as we could (see our notes on data coverage), we know this isn't the complete picture. Some cases don't make the news, others might be reported in languages we don't yet cover, and press freedom varies greatly between countries.</p>

<p>You can search, rank and filter the information easily. Want to focus on a specific country? Type it in. Interested in particular types of corruption? Use our filters. Need to analyze the data yourself? Download everything in CSV format. The power is in your hands to explore and understand this crucial issue.</p>

<p>Whether you're a researcher, journalist, healthcare professional, or concerned citizen, we hope this tool helps you better understand how integrity issues affect healthcare systems around the world.</p>
              </div>
            </div>
          </div>
          <!-- BLOCK 3 -->
          <div class="panel panel-default">
            <div class="panel-heading">
              <h1 class="panel-title">
                <a data-toggle="collapse" data-parent="#accordion" href="#collapse3">2.NOTES ON THE THE DATA</a>
              </h1>
            </div>
            <div id="collapse3" class="panel-collapse collapse in">
              <div class="panel-body">
<p>We get our stories from thousands of online news outlets globally through our partner Newscatcher. We use AI (specifically Large Language Models) to read articles and add tags that let you filter the content.
LLMs are brilliant at this job because they understand nuance and context in text. Corruption is tricky to pin down - it's subjective, often hard to spot, and takes many forms. Traditional keyword searches often miss relevant stories or pick up irrelevant ones. But LLMs can spot integrity-related content even when obvious words like 'bribery' or 'embezzlement' aren't there. This means we can process huge amounts of news in a way that wasn't possible before. Of course, like any human, the AI sometimes gets things wrong. This risk is higher with corruption - even experts argue about how to define it.<br><br>
When we tag articles as integrity-related, we're not making accusations. We're simply noting that the AI found content directly linked to integrity concepts. And while a story's headline might not mention corruption, the AI reads the full article, so the relevant content is likely inside.<br><br>
A key point about the numbers: seeing more stories in one country doesn't mean it has more corruption. We only use English language stories for now, and things like press freedom and internet access vary hugely between places. While we're confident we catch most relevant stories, we can't guarantee we get them all. That's why this tool is for exploring individual cases rather than comparing different places.</p>

<p>we rely entirely on what news articles report. Just because we haven't tagged any stories about a particular type of corruption in a certain place doesn't mean it isn't happening there - it just means we haven't found English language news coverage that meets our specific criteria.</p>


<br><p>In sum:</p><li>
We do not have all data on corruption everywhere. We have tried to get as much as is available but that is limited by a number of factors including press freedom, internet access etc.</li><br>

<li>Our data is only collected from publications 2023 onwards. This, combined with the previous point, means certain articles may not be present.</li><br>

<li>Whilst outputs have been independently verified by humans in the development phase of this tool, it is designed to run semi-automatically without human oversight on an article-by-article basis. This also means we cannot manually updload news articles that are not captured.</li><br>

<li>AI is imperfect. Whilst we are confident that the classifications are as accurate as they can be without much more time and resource, LLMs have their own biases and misunderstandings. This means classifications can be wrong or not align with TI Global Health's view.</li><br>

<li>An article being tagged in a particular category of integrity does not accuse anyone of anything untoward. It simply means that the AI has found some content of the article to be relevant to that specific categorisation.</li>

              </div>
            </div>
          </div>

          <!-- CONTACTS -->
          <div class="panel panel-default panel-static">
            <div class="panel-heading">
              <h2 class="panel-title">
                <a href="#">CONTACT DETAILS</a>
              </h2>
            </div>
            <div id="contact" class="panel-collapse">
              <div class="panel-body">
                <p>If your questions have not been answered here please contact:</p>
                <p>
                + 44 (0)20 3096 7676
                <a href="mailto:ti-health@transparency.org">ti-health@transparency.org</a>
                </p>
              </div>
            </div>
          </div>
          <!-- SPONSORS -->
          <div class="panel panel-default panel-static">
            <div class="panel-heading">
              <h2 class="panel-title">
                <a href="#">PROJECT SPONSORS</a>
              </h2>
            </div>
            <div id="contact" class="panel-collapse">
              <div class="panel-body">
<p>The project is funded by:</p> <img src="https://www.giz.de/static/en/images/giz-logo.gif"></img>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
    <script src="static/about.js"></script>
	<script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>