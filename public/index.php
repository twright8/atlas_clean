<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AIMon</title>
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
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.9.0/js/bootstrap-datepicker.min.js"></script>
	<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@200..700&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="static/style.css"> <!-- Custom styles -->
</head>

<body>
    <?php include 'header.php' ?>
    <div id="infoCardOverlay" class="info-card-overlay">
        <div class="info-card">
            <h2>Welcome to the Health Atlas</h2>

            <p>Explore global health sector integrity issues and scandals on our interactive map as reported by english language news providers. Use the filters to narrow down your search and click on markers to learn more about specific cases.</p>
			<div class="logods">
			            <button id="closeInfoCard">Got it, thanks!</button>
			<div class="logos">
			<p>Data provided by:</p>
			<img src="/images/newscatcher.png" loading="lazy" alt="" style="width:100%; max-width:150px"></div>

        </div></div>
    </div>
    <div class="container-fluid dashboard-container-outer">
	    <div class="custom-container">
			
        <div class="row align-items-center mb">
            <div class="col-md-8 mb-3 mb-md-0 bdd">
			
				<div class="col-md-5"><h1>HEALTH ATLAS</h1></div>
                <div class="col-md-7"><p class="m-0">Healthcare systems worldwide struggle with integrity issues. Investigate recent news stories exposing these problems in various countries.</p></div>
            </div>
            <div class="col-md-4 d-flex justify-content-end">
<div class="switch-container">
    <button id="map-overview-btn" class="switch-button active">Map Overview</button>
    <button id="cases-btn" class="switch-button">List</button>
</div>
            </div>
        </div>
    </div>

            <!-- Add this section for date range filter -->
			    <div class="container-fluid footer-bar">
        <div class="row"><div class="fil"/>
            <div id="clicker2" class="footer-col col-9 col-sm-9 footer-counts">			  
                <div id="data-count" class="dc-data-count count-box">
                    <div class="filter-count">0</div>out of <strong class="total-count">0</strong> articles
                </div>
                <div class="footer-input">
                    <input type="text" id="search-input" placeholder="SEARCH BY TITLE OF ARTICLE">
                    <i class="material-icons"></i>
                </div>
            </div>      <div class="col-1 col-sm-1" id="export-button-container"></div>  <div id="clicker" class="footer-col col-2 col-sm-2 footer-counts filters">		 <h3 class="filter_head">Filters </h3><span class="expand-icon" style="font-size:large">▼</span></div></div>
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
            <label class="space_b"  for="corruptionCategoriesFilter">Corruption Type <span class="info-icon" id="corruption-info" data-filter="corruption">i</span></label>
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
    <label class="space_b">Industry <span class="info-icon" id="industry-info" data-filter="industry">i</span></label>
    <div class="industry-buttons">
        <button id="health-industry" class="industry-btn" title="Health">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="100%"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M228.3 469.1L47.6 300.4c-4.2-3.9-8.2-8.1-11.9-12.4l87 0c22.6 0 43-13.6 51.7-34.5l10.5-25.2 49.3 109.5c3.8 8.5 12.1 14 21.4 14.1s17.8-5 22-13.3L320 253.7l1.7 3.4c9.5 19 28.9 31 50.1 31l104.5 0c-3.7 4.3-7.7 8.5-11.9 12.4L283.7 469.1c-7.5 7-17.4 10.9-27.7 10.9s-20.2-3.9-27.7-10.9zM503.7 240l-132 0c-3 0-5.8-1.7-7.2-4.4l-23.2-46.3c-4.1-8.1-12.4-13.3-21.5-13.3s-17.4 5.1-21.5 13.3l-41.4 82.8L205.9 158.2c-3.9-8.7-12.7-14.3-22.2-14.1s-18.1 5.9-21.8 14.8l-31.8 76.3c-1.2 3-4.2 4.9-7.4 4.9L16 240c-2.6 0-5 .4-7.3 1.1C3 225.2 0 208.2 0 190.9l0-5.8c0-69.9 50.5-129.5 119.4-141C165 36.5 211.4 51.4 244 84l12 12 12-12c32.6-32.6 79-47.5 124.6-39.9C461.5 55.6 512 115.2 512 185.1l0 5.8c0 16.9-2.8 33.5-8.3 49.1z" fill="white"/></svg>

        </button>
        <button id="defence-industry" class="industry-btn" title="Defence">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="100%"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 0c4.6 0 9.2 1 13.4 2.9L457.7 82.8c22 9.3 38.4 31 38.3 57.2c-.5 99.2-41.3 280.7-213.6 363.2c-16.7 8-36.1 8-52.8 0C57.3 420.7 16.5 239.2 16 140c-.1-26.2 16.3-47.9 38.3-57.2L242.7 2.9C246.8 1 251.4 0 256 0zm0 66.8l0 378.1C394 378 431.1 230.1 432 141.4L256 66.8s0 0 0 0z" fill="white"/></svg>
        </button>
    </div>
</div>
		            <div class="filter-group">
                <label class="space_b" for="archivedFilter">
                    Show Archived <span class="info-icon" id="archived-info" data-filter="archived">i</span>
                </label>
<div id="arch" class="custom-checkbox">
    <input type="checkbox" id="archivedFilter" checked>
    <label for="archivedFilter">Include archived articles</label>
</div>
            </div>
					            <div class="filter-group">
                <label class="space_b" for="caseFilter">
                    Cases <span class="info-icon" id="case-info" data-filter="cased">i</span>
                </label>
<div id="arch" class="custom-checkbox">
    <input type="checkbox" id="caseFilter">
    <label for="caseFilter">Include non-case articles</label>
</div>
            </div>
								            <div class="filter-group">
                <label class="space_b" for="unreliableFilter">
                    Unreliable articles <span class="info-icon" id="unreliable-info" data-filter="unreliable">i</span>
                </label>
<div id="arch" class="custom-checkbox">
    <input type="checkbox" id="unreliableFilter">
    <label for="unreliableFilter">Include unreliable articles (beta)</label>
</div>
            </div>
			<!-- Add this inside the filter-content div, after the existing filter groups -->

        <button id="resetFilters" class="btn reseter btn-secondary">Reset Filters</button></div>
    </div>
</div>
        </div>
            <div id="mapholder" class="col-12 mb-3">
                <div id="map" ></div>
				<div id="mask">
                <table id="dc-data-table" class="table table-hover dc-data-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Country/Region</th>
                            <th>URL</th>
                            <th>Date</th>
							<th>Corruption Types</th>
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