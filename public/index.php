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
			<img src="https://res.cloudinary.com/postman/image/upload/t_team_logo/v1629882357/team/f8940af7f4a0949b4b8f860573a34e504ab03484d2b2c88ccc1bc1c4b88bc93f" loading="lazy" alt="" style="width:100%; max-width:150px"></div>

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
            <div id="clicker2" class="footer-col col-10 col-sm-10 footer-counts">			  
                <div id="data-count" class="dc-data-count count-box">
                    <div class="filter-count">0</div>out of <strong class="total-count">0</strong> articles
                </div>
                <div class="footer-input">
                    <input type="text" id="search-input" placeholder="SEARCH BY TITLE">
                    <i class="material-icons"></i>
                </div>
            </div>        <div id="clicker" class="footer-col col-2 col-sm-2 footer-counts filters">		 <h3 class="filter_head">Filters </h3><span class="expand-icon" style="font-size:large">▼</span></div></div>
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
        <div class="filter-group">
            <label class="space_b" >Date Range <span class="info-icon" id="date-info" data-filter="date">i</span></label>
            <div class="input-group">
                <input type="text" class="form-control" id="startDate" placeholder="Start Date">
                <div class="input-group-prepend input-group-append">
                    <span class="input-group-text">to</span>
                </div>
                <input type="text" class="form-control" id="endDate" placeholder="End Date">
            </div>
        </div>
		            <div class="filter-group">
                <label class="space_b" for="archivedFilter">
                    Show Archived <span class="info-icon" id="archived-info" data-filter="archived">i</span>
                </label>
<div id="arch" class="custom-checkbox">
    <input type="checkbox" id="archivedFilter" checked>
    <label for="archivedFilter">Include archived entries</label>
</div>
            </div>
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

</div>     <div class="row share"><div class ="sharer" id="export-button-container"></div><div class="sharer"><button id="twitter_share" class ="btn btn-sm btn-outline-secondary export-csv-button btn-sharer"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-twitter-x" viewBox="0 0 16 16">
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
providing links on the cHeatmap we are not providing any assurance that you have the necessary intellectual
property licences to link to, view or use any part of the content found on the linked websites. It is your
responsibility to review any terms and conditions for linked sites, and to comply with them. We will not be liable
to you for you accessing links via this cHeatmap, or viewing any of the content of the linked sites.</p>
<p class="discl" style="margin-bottom: 1rem; font-weight:600">Terms and Conditions</p>
<p class="discl">cHeatmap is provided by us in furtherance of our charitable purposes and for the public benefit and
interest. The mission and objective of cHeatmap is to allow users to search for news articles from around the
world giving examples or discussion of corruption in the health sector and download our data.
We are not responsible for websites we link (including hyperlink) to and we have no control over the contents of
linked sites, nor do we adopt or endorse any statements found on linked sites. We do not take a position on
whether information found on linked sites is true or accurate. Where cHeatmap contains links to other sites, these
are selected using automated AI software and are provided on an 'as is' basis by us. Links should not be
interpreted as approval or selection by us of those linked sites, or the information you may obtain from them.
By providing links on cHeatmap we are not guaranteeing that you have the necessary intellectual property licences
to click through to, view or use any part of the content found on the linked sites. It is your responsibility to
review any terms and conditions for any linked sites, and to comply with them. We will not be liable for any loss
caused as a result of you clicking on links on cHeatmap; or accessing, reading or using any of the content found
on linked sites.</p>
<p class="discl">To the extent permitted by law, we do not accept any responsibility for any use of, or statements
on, linked sites. For the avoidance of confusion, we will not be liable for any loss caused as a result of your
doing, or not doing, anything as a result of viewing or reading linked sites. In particular, we do not warrant
that any linked site or any of its contents is virus or harm free. You must take your own precautions in this
respect as we accept no responsibility for any infection by virus or other harm or contamination, or by anything
which has destructive properties, from accessing linked sites via cHeatmap.
Although we will do our best to provide constant, uninterrupted access to cHeatmap, we do not guarantee this. We
accept no responsibility or liability for any unavailability, interruption or delay.
</p>
<section>
<footer class="foot">
<p style="font-size: 13px; margin-left: 15px">© 2024 Transparency International. All rights reserved.</p>
</footer>
</section></section>
</body>
</html>