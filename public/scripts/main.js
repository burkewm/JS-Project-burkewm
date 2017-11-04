// prototype for the Restaurant class
var Restaurant = {
    
        getFullAddress: function() {
            return this.address + "<br>" + this.city + ", " + this.state + "&nbsp;&nbsp;" + this.zip;
        }
    
    };
    
    window.onload = function() {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", "/cuisines", true);
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

                var cuisines = JSON.parse(xmlhttp.responseText);
                buildMenu(cuisines);
                getRestaurants(cuisines[0]);
            }
        };
        xmlhttp.send(null);
    };
    
    
    function buildMenu(cuisines) {
    
        // get the menu element
        var menu = document.getElementById("cuisine-menu");
        var first = true;
    
        //Create a radio button per element inside of cuisine
        cuisines.forEach(function(cuisine) {
            var radiobtn = document.createElement("input");
            radiobtn.type = "radio";
            radiobtn.id = cuisine;
            radiobtn.value = cuisine
            radiobtn.name = "cuisine";
            radiobtn.onclick = function(){selectCuisine(this)};
            if (first == true) {
                first = false;
                radiobtn.setAttribute("checked", "true");
            }
            //Add text to the radio buttons
            menu.appendChild(radiobtn);
            var btnText = document.createElement("radioText");
            btnText.innerText = " " + cuisine;
            menu.appendChild(btnText);
            menu.appendChild(document.createElement("hr"));
        });
    
    }

    function selectCuisine(radiobtn) {
        getRestaurants(radiobtn.value);
    }
    
    
    function getRestaurants(selectedCuisine) {
        var restaurants = [];
    
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", "/restaurants/" + selectedCuisine, true);
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var values = JSON.parse(xmlhttp.responseText);
                values.forEach(function(restaurant) {
                    Object.setPrototypeOf(restaurant, Restaurant);
                    restaurants.push(restaurant);
                })
                showRestaurants(restaurants);
            }
        };
        xmlhttp.send(null);
    }
    
    function showRestaurants(restaurants) {
    
        var info = document.getElementById("restaurant-info");
    
        info.innerHTML = "";
    
        for (var i = 0; i < restaurants.length; i++) {

            //Create the title to be the restaurants name
            var title = document.createElement("title");
            title.innerHTML = restaurants[i].name;
            info.appendChild(title);

            //Create a new Div for Address
            var addressDiv = document.createElement("div");
            addressDiv.innerHTML = restaurants[i].getFullAddress();
            info.appendChild(addressDiv);

            //Create a new Div for Review
            var showReviewDiv = document.createElement("div");
            showReviewDiv.class = "review-div";
            showReviewDiv.innerHTML = "Review";

            //Set attributes for the + & minus button
            var img = document.createElement("img");
            img.src = "/images/plus.png";
            img.className = "icon";
            img.id = ("id", "review-toggle-" + i);
            img.setAttribute("onclick", "toggleReview(" + i + ")");
            showReviewDiv.appendChild(img);
            info.appendChild(showReviewDiv);
            var reviewDiv = document.createElement("div");

            //Need to make sure the reviews are hidden at the start, set to none
            reviewDiv.style.display = 'none';
            reviewDiv.id = "review-" + i;
            //Add review text, index array via r

            for (var r = 0; r < restaurants[i].review.length; r++) {
                var reviewParagraph = document.createElement("p");
                reviewParagraph.innerText = restaurants[i].review[r].text;
                reviewDiv.appendChild(reviewParagraph);
            }
            //Create rating element
            var ratings = document.createElement("p");

            /* If You Wanted to do a Star based system \*
            for(s= 0; s < restaurants[i].rating; s++){
                ratings.innerText += "*";
            }
            ratings.innerText += " / 5";
            \*                 END                    */
            
            ratings.innerText = "Rating: " + restaurants[i].rating + "/5";
            reviewDiv.appendChild(ratings);
            info.appendChild(reviewDiv);
            if (i < restaurants.length - 1) {
                var hr = document.createElement("hr");
                info.appendChild(hr);
            }
    
        }
    
    }
    
    
    // use this function to show and hide the review
    function toggleReview(i) {
    
        // set the 'toggle' image
        var toggleImg = document.getElementById("review-toggle-" + i);
    
        var display = "none";
        var src = "/images/plus.png"
    
        if (toggleImg.getAttribute("src").indexOf("plus") > -1) {
            // currently displaying plus
            src = "/images/minus.png"
            display = "block";
        }
    
        toggleImg.setAttribute("src", src);
    
        // show/hide the review
        var reviewDiv = document.getElementById("review-" + i)
        reviewDiv.style.display = display;
    
    }