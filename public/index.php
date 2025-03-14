<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Health Atlas</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster/dist/MarkerCluster.css" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster/dist/MarkerCluster.Default.css" />
	<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
<link rel="apple-touch-icon-precomposed" sizes="57x57" src="https://ti-health.org/wp-content/themes/tiuk-pharma-18/media/favicons/apple-touch-icon-57x57.png" />
<link rel="apple-touch-icon-precomposed" sizes="114x114" src="https://ti-health.org/wp-content/themes/tiuk-pharma-18/media/favicons/apple-touch-icon-114x114.png" />
<link rel="apple-touch-icon-precomposed" sizes="72x72" src="https://ti-health.org/wp-content/themes/tiuk-pharma-18/media/favicons/apple-touch-icon-72x72.png" />
<link rel="apple-touch-icon-precomposed" sizes="144x144" src="https://ti-health.org/wp-content/themes/tiuk-pharma-18/media/favicons/apple-touch-icon-144x144.png" />
<link rel="apple-touch-icon-precomposed" sizes="60x60" src="https://ti-health.org/wp-content/themes/tiuk-pharma-18/media/favicons/apple-touch-icon-60x60.png" />
<link rel="apple-touch-icon-precomposed" sizes="120x120" src="https://ti-health.org/wp-content/themes/tiuk-pharma-18/media/favicons/apple-touch-icon-120x120.png" />
<link rel="apple-touch-icon-precomposed" sizes="76x76" src="https://ti-health.org/wp-content/themes/tiuk-pharma-18/media/favicons/apple-touch-icon-76x76.png" />
<link rel="apple-touch-icon-precomposed" sizes="152x152" src="https://ti-health.org/wp-content/themes/tiuk-pharma-18/media/favicons/apple-touch-icon-152x152.png" />
<link rel="icon" type="image/png" src="https://ti-health.org/wp-content/themes/tiuk-pharma-18/media/favicons/favicon-196x196.png" sizes="196x196" />
<link rel="icon" type="image/png" src="https://ti-health.org/wp-content/themes/tiuk-pharma-18/media/favicons/favicon-96x96.png" sizes="96x96" />
<link rel="icon" type="image/png" src="https://ti-health.org/wp-content/themes/tiuk-pharma-18/media/favicons/favicon-32x32.png" sizes="32x32" />
<link rel="icon" type="image/png" src="https://ti-health.org/wp-content/themes/tiuk-pharma-18/media/favicons/favicon-16x16.png" sizes="16x16" />
<link rel="icon" type="image/png" src="https://ti-health.org/wp-content/themes/tiuk-pharma-18/media/favicons/favicon-128.png" sizes="128x128" />
<link rel="icon" type="image/x-icon" href="https://ti-health.org/wp-content/themes/tiuk-pharma-18/media/favicons/favicon.ico" />
    <script src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js"></script>
    <script src="https://unpkg.com/leaflet.markercluster/dist/leaflet.markercluster-src.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="https://d3js.org/d3.v5.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/crossfilter2/1.4.6/crossfilter.min.js"></script>
    <script src="https://cdn.datatables.net/1.10.21/js/jquery.dataTables.min.js"></script>
    <link rel="stylesheet" href="https://cdn.datatables.net/1.10.21/css/jquery.dataTables.min.css"/>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/js/select2.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/css/select2.min.css"/>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.css"/>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.js"></script>
    <!-- Add these lines for datepicker -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.9.0/css/bootstrap-datepicker.min.css">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">


    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.9.0/js/bootstrap-datepicker.min.js"></script>
	<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@200..700&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="static/style.css"> <!-- Custom styles -->
    <link rel="stylesheet" href="static/dashboard.css"> <!-- Dashboard styles -->
</head>

<body>
    <?php include 'header.php' ?>
    <div id="infoCardOverlay" class="info-card-overlay">
        <div class="info-card">
            <h2>Welcome to the Health Atlas</h2>

            <p>See healthcare integrity cases mapped worldwide. Filter by country, health sector area or issue type, and click points to read full news stories. Download and analyse data or identify case studies</p>
			<p>This dashboard shows thousands of news articles since 2023. Data is updated monthly and coverage varies by region. See About page for details.</p>
			<hr>
			<p><strong>Quickstart</strong></p>

<div style="display: flex; flex-direction: column; gap: 25px; max-width: 600px;">
    <div style="display: flex; align-items: center;">
        <p style="margin: 0; flex: 1;">Zoom in, drag, or click the map to discover recent news stories exposing these problems.</p>
        <div style="width: 60px; display: flex; justify-content: center;">
            <i class="fa fa-arrows" aria-hidden="true" style="font-size: 24px;"></i>
        </div>
    </div>
    
    <div style="display: flex; align-items: center;">
        <p style="margin: 0; flex: 1;">Articles appear as heat circles when clustered together...</p>
        <div style="width: 60px; display: flex; justify-content: center;">
            <img src="hm.png" style="width: 40px; height: 40px;" alt="Heat map cluster"/>
        </div>
    </div>

    <div style="display: flex; align-items: center;">
        <p style="margin: 0; flex: 1;">... or individual pins when zoomed in.</p>
        <div style="width: 60px; display: flex; justify-content: center;">
            <i style="color: #3694d1;" class="fa fa-map-marker fa-3x"></i>
        </div>
    </div>

    <div style="display: flex; align-items: center;">
        <p style="margin: 0; flex: 1;">Click the 'i' next to filters for explanations.</p>
        <div style="width: 60px; display: flex; justify-content: center;">
            <img src="i.png" style="width: 24px;" alt="Information icon"/>
        </div>
    </div>
	    <div style="display: flex; align-items: center;">
<p style="margin: 0; flex: 1;">Enter keywords in the search bar to find articles that interest you.</p>
        <div style="width: 60px; display: flex; justify-content: center;">
            <i class="fa fa-search" style="font-size:2rem"></i>
        </div>
    </div>
		    <div style="display: flex; align-items: center;">
<p style="margin: 0; flex: 1;">Click the question mark to re-open this guide.</p>
        <div style="width: 60px; display: flex; justify-content: center;">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM169.8 165.3c7.9-22.3 29.1-37.3 52.8-37.3l58.3 0c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24l0-13.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1l-58.3 0c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>

        </div>
    </div>
</div>
			
			<hr>
			<br>
			<div class="logods">
			            <button id="closeInfoCard" style="margin-top:0px">Got it, thanks!</button>
			<div class="logos">
			<p style="margin-bottom:0px">Data provided by:</p>
			<img src="/images/newscatcher.png" loading="lazy" alt="" style="width:100%; max-width:150px"></div>

        </div></div>
    </div>
    <div class="container-fluid dashboard-container-outer">
	    <div class="custom-container">
			
        <div class="row align-items-center mb">
            <div class="col-md-8 mb-3 mb-md-0 bdd">
			
				<div class="col-md-5"><h1>HEALTH ATLAS</h1></div>
                <div class="col-md-7"><p class="m-0">Healthcare systems worldwide struggle with integrity issues. Explore the map to investigate recent news stories exposing these problems in various countries.</p></div>
            </div>
            <div class="col-md-4 d-flex justify-content-end">
<div class="switch-container">
    <button id="map-overview-btn" class="switch-button active">Map</button>
    <button id="cases-btn" class="switch-button">List</button>
    <button id="dashboard-btn" class="switch-button"><i class="fa fa-bar-chart"></i></button>
</div>
            </div>
        </div>
    </div>

            <!-- Add this section for date range filter -->
<div class="container-fluid footer-bar fil">
    <div id="clicker2" class="footer-col footer-counts">			  
        <div id="data-count" class="dc-data-count count-box">
            <div class="filter-count">0</div>out of <strong class="total-count">0</strong> articles
        </div>
        <div id="searcherer">
            <div class="footer-input">
                <input type="text" id="search-input" placeholder="SEARCH BY TITLE OF ARTICLE">
                <i class="fa fa-search"></i>
            </div>
        </div>
    </div>      
    <div id="filters_buts">
        <div id="export-button-container"></div>
		<div id="help-button-container"></div>
        <div id="clicker" class="footer-col col-2 col-sm-2 footer-counts filters">		 
            <h3 class="filter_head">Filters </h3><span class="expand-icon" style="font-size:large">▼</span>
        </div>
    </div>
</div>
        <div class="row">

<div class="filter-box">

    <div class="filter-content">
	<div class="button-container" style="padding: 20px;">
        <div class="filter-group">
            <label class="space_b" for="countryFilter">Country / Region <span class="info-icon" id="country-info" data-filter="country">i</span></label>
            <select id="countryFilter" multiple="multiple" class="form-control"></select>
        </div>
        <div class="filter-group">
            <label class="space_b"  for="corruptionCategoriesFilter">Integrity Area <span class="info-icon" id="corruption-info" data-filter="corruption">i</span></label>
            <select id="corruptionCategoriesFilter" multiple="multiple" class="form-control"></select>
        </div>
        <div class="filter-group">
            <label class="space_b"  for="healthCategoriesFilter">Health Area <span class="info-icon" id="health-info" data-filter="health">i</span></label>
            <select id="healthCategoriesFilter" multiple="multiple" class="form-control"></select>
        </div>
        <div class="filter-group date_filter">
            <label class="space_b" >Date Range <span class="info-icon" id="date-info" data-filter="date">i</span></label>
            <div class="input-group">
                <input type="text" class="form-control" id="startDate" placeholder="Start Date">
                <div class="input-group-prepend input-group-append">
                    <span class="input-group-text">to</span>
                </div>
                <input type="text" class="form-control" id="endDate" placeholder="End Date">
            </div>
        </div><div class="filter-group">
    <label class="space_b" for="countryLevelFilter">
       Location precision <span class="info-icon" id="country-level-info" data-filter="countryLevel">i</span>
    </label>
    <div id="arch" class="custom-checkbox">
        <input type="checkbox" id="countryLevelFilter" checked>
        <label for="countryLevelFilter">Exclude country-level only articles</label>
    </div>
</div>
		            <div class="filter-group">
                <label class="space_b" for="archivedFilter">
                    Show Archived <span class="info-icon" id="archived-info" data-filter="archived">i</span>
                </label>
<div id="arch" class="custom-checkbox">
    <input type="checkbox" id="archivedFilter">
    <label for="archivedFilter">Exclude archived articles</label>
</div>
            </div>
					            <div class="filter-group">
                <label class="space_b" for="caseFilter">
                    Cases <span class="info-icon" id="case-info" data-filter="cased">i</span>
                </label>
<div id="arch" class="custom-checkbox">
    <input type="checkbox" id="caseFilter" checked>
    <label for="caseFilter">Exclude non-case articles</label>
</div>
            </div>
								            <div class="filter-group">
                <label class="space_b" for="unreliableFilter">
                    Unreliable articles <span class="info-icon" id="unreliable-info" data-filter="unreliable">i</span>
                </label>
<div id="arch" class="custom-checkbox">
    <input type="checkbox" id="unreliableFilter" checked>
    <label for="unreliableFilter">Exclude unreliable articles (beta)</label>
</div>
            </div>
			<!-- Add this inside the filter-content div, after the existing filter groups -->

        <button id="resetFilters" class="btn reseter btn-secondary">Reset Filters</button></div>
    </div>
</div>
        </div>
            <div id="mapholder" class="col-12 mb-3">
                <div id="map"></div>
                <div id="dashboard"></div>
				<div id="mask">
                <table id="dc-data-table" class="table table-hover dc-data-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Country/Region</th>
                            <th>URL</th>
                            <th>Date</th>
							<th>Integrity Area</th>
                        </tr>
                    </thead>
                </table>

</div>     <div class="row share"><div class="sharer"><button id="twitter_share" class ="btn btn-sm btn-outline-secondary export-csv-button btn-sharer"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-twitter-x" viewBox="0 0 16 16">
  <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/>
</svg></button> </div><div class="sharer"><button id="lin_share" class ="btn btn-sm btn-outline-secondary export-csv-button btn-sharer"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-facebook" viewBox="0 0 16 16">
  <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/>
</svg>
</svg></button></div></div></div>
            </div>

        </div>
    </div>

    <script src="static/map.js"></script>
    <!-- Add event listener for window resize to make dashboard responsive -->
    <script>
        window.addEventListener('resize', function() {
            if (typeof handleDashboardResize === 'function') {
                handleDashboardResize();
            }
        });
    </script>
	<hr style="padding:20px">
<section class="disclaimers">
<h4 class="title">Disclaimers</h4>
<p class="discl">
We are not responsible for websites we link (including hyperlink) to and we have no control over the contents of
linked sites (and do not endorse linked content or take any position on whether it is true or accurate). By
providing links on the Health Atlas we are not providing any assurance that you have the necessary intellectual
property licences to link to, view or use any part of the content found on the linked websites. It is your
responsibility to review any terms and conditions for linked sites, and to comply with them. We will not be liable
to you for you accessing links via this Health Atlas, or viewing any of the content of the linked sites.</p>
<p class="discl" style="margin-bottom: 1rem; font-weight:600">Terms and Conditions</p>
<p class="discl">Health Atlas is provided by us in furtherance of our charitable purposes and for the public benefit and
interest. The mission and objective of Health Atlas is to allow users to search for news articles from around the
world giving examples or discussion of corruption in the health sector and download our data.
We are not responsible for websites we link (including hyperlink) to and we have no control over the contents of
linked sites, nor do we adopt or endorse any statements found on linked sites. We do not take a position on
whether information found on linked sites is true or accurate. Where Health Atlas contains links to other sites, these
are selected using automated AI software and are provided on an 'as is' basis by us. Links should not be
interpreted as approval or selection by us of those linked sites, or the information you may obtain from them.
By providing links on Health Atlas we are not guaranteeing that you have the necessary intellectual property licences
to click through to, view or use any part of the content found on the linked sites. It is your responsibility to
review any terms and conditions for any linked sites, and to comply with them. We will not be liable for any loss
caused as a result of you clicking on links on Health Atlas; or accessing, reading or using any of the content found
on linked sites.</p>
<p class="discl">To the extent permitted by law, we do not accept any responsibility for any use of, or statements
on, linked sites. For the avoidance of confusion, we will not be liable for any loss caused as a result of your
doing, or not doing, anything as a result of viewing or reading linked sites. In particular, we do not warrant
that any linked site or any of its contents is virus or harm free. You must take your own precautions in this
respect as we accept no responsibility for any infection by virus or other harm or contamination, or by anything
which has destructive properties, from accessing linked sites via Health Atlas.
Although we will do our best to provide constant, uninterrupted access to Health Atlas, we do not guarantee this. We
accept no responsibility or liability for any unavailability, interruption or delay.
</p>
<section>
<footer class="foot">
<p style="font-size: 13px; margin-left: 15px">© 2024 Transparency International. All rights reserved.</p>
</footer>
</section></section>
</body>
</html>