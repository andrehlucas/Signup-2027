# WordPress REST API Integration Documentation

## Overview

This document outlines the WordPress REST API endpoints required for the Opus Virtual Offices website. The backend uses WordPress Custom Post Types (CPT) with Advanced Custom Fields (ACF) to manage content.

## Authentication

**Status:** TBD (To Be Determined)

Authentication requirements will be determined based on whether the API endpoints need to be public or private. Options include:
- No authentication (public read-only endpoints)
- WordPress Application Passwords
- JWT tokens
- OAuth 2.0

---

## 1. Location Search API

### Overview
Provides search functionality for office locations by city, state, or ZIP code. Special behavior: if only one result matches the search query (except ZIP searches), return the location detail page instead of search results.

### WordPress Backend Requirements

#### Custom Post Type: `location`
```php
register_post_type('location', array(
    'public' => true,
    'show_in_rest' => true,
    'rest_base' => 'locations',
    'label' => 'Locations',
    // ... other args
));
```

#### Required ACF Fields
Enable "Show in REST API" for the Location field group:

| Field Name | Field Key | Type | Required | Description |
|------------|-----------|------|----------|-------------|
| `city` | `field_city` | Text | Yes | City name (e.g., "San Diego") |
| `state` | `field_state` | Text | Yes | State abbreviation (e.g., "CA") |
| `state_full` | `field_state_full` | Text | Yes | Full state name (e.g., "California") |
| `zip_code` | `field_zip_code` | Text | Yes | 5-digit ZIP code |
| `location_type` | `field_location_type` | Select | Yes | Options: "city", "state" |
| `is_premium` | `field_is_premium` | True/False | No | Premium location badge |
| `address_line_1` | `field_address_line_1` | Text | No | Street address |
| `address_line_2` | `field_address_line_2` | Text | No | Suite/Unit number |

### Endpoints

#### Search All Locations
```
GET {WORDPRESS_URL}/wp-json/wp/v2/locations?search={query}
```

**Query Parameters:**
- `search` - Search term (city name, state name, or ZIP code)
- `per_page` - Results per page (default: 10, max: 100)
- `_fields` - Limit response fields (optional, for optimization)

**Example Request:**
```
GET /wp-json/wp/v2/locations?search=San+Diego&_fields=id,title,acf,link
```

**Expected Response Structure:**
```json
[
  {
    "id": 123,
    "title": {
      "rendered": "San Diego, CA"
    },
    "link": "https://example.com/locations/san-diego-ca",
    "acf": {
      "city": "San Diego",
      "state": "CA",
      "state_full": "California",
      "zip_code": "92101",
      "location_type": "city",
      "is_premium": false
    }
  }
]
```

#### Search by City
```
GET {WORDPRESS_URL}/wp-json/wp/v2/locations?filter[meta_key]=city&filter[meta_value]={city_name}
```

Alternative using custom endpoint (recommended):
```
GET {WORDPRESS_URL}/wp-json/opus/v1/locations/search?type=city&q={city_name}
```

#### Search by State
```
GET {WORDPRESS_URL}/wp-json/opus/v1/locations/search?type=state&q={state_abbreviation}
```

**Example:**
```
GET /wp-json/opus/v1/locations/search?type=state&q=CA
```

#### Search by ZIP Code
```
GET {WORDPRESS_URL}/wp-json/opus/v1/locations/search?type=zip&q={zipcode}
```

**Example:**
```
GET /wp-json/opus/v1/locations/search?type=zip&q=92101
```

#### Single Location Detail
```
GET {WORDPRESS_URL}/wp-json/wp/v2/locations/{id}
```

### Single Result Behavior

**Frontend Logic:**
When search returns exactly 1 result (excluding ZIP code searches), the frontend should:
1. Detect `results.length === 1` and `searchType !== 'zip'`
2. Display the single location as a clickable item in the dropdown
3. Navigate directly to the location page URL when clicked

**Backend Requirement:**
Ensure each location post has a permalink/link field in the response for direct navigation.

### Frontend Integration Example

```typescript
// In client/src/lib/api/locations.ts
import { useQuery } from '@tanstack/react-query';

interface Location {
  id: number;
  title: { rendered: string };
  link: string;
  acf: {
    city: string;
    state: string;
    state_full: string;
    zip_code: string;
    location_type: 'city' | 'state';
    is_premium?: boolean;
  };
}

export function useLocationSearch(query: string) {
  return useQuery<Location[]>({
    queryKey: ['/api/locations/search', query],
    enabled: query.length >= 2,
  });
}

// Backend API route (server/routes.ts)
app.get('/api/locations/search', async (req, res) => {
  const { q } = req.query;
  const wpUrl = process.env.WORDPRESS_API_URL;
  
  const response = await fetch(
    `${wpUrl}/wp-json/wp/v2/locations?search=${encodeURIComponent(q)}&_fields=id,title,acf,link`
  );
  const data = await response.json();
  
  res.json(data);
});
```

---

## 2. FAQ API

### Overview
Retrieves FAQ items that are marked to show on the homepage.

### WordPress Backend Requirements

#### Custom Post Type: `faq`
```php
register_post_type('faq', array(
    'public' => true,
    'show_in_rest' => true,
    'rest_base' => 'faqs',
    'label' => 'FAQs',
));
```

#### Required ACF Fields

| Field Name | Field Key | Type | Required | Description |
|------------|-----------|------|----------|-------------|
| `question` | `field_question` | Text | Yes | FAQ question |
| `answer` | `field_answer` | Wysiwyg Editor | Yes | FAQ answer (HTML) |
| `show_on_home_page` | `field_show_on_home_page` | True/False | Yes | Display on homepage |
| `sort_order` | `field_sort_order` | Number | No | Display order |

### Endpoint

```
GET {WORDPRESS_URL}/wp-json/opus/v1/faqs/homepage
```

**Alternative using meta_query:**
```
GET {WORDPRESS_URL}/wp-json/wp/v2/faqs?meta_key=show_on_home_page&meta_value=1
```

**Query Parameters:**
- `per_page` - Number of FAQs to return (default: 10)
- `orderby` - Sort field (e.g., "meta_value_num" for sort_order)
- `order` - Sort direction (asc/desc)

**Example Request:**
```
GET /wp-json/opus/v1/faqs/homepage?per_page=20&orderby=menu_order&order=asc
```

**Expected Response Structure:**
```json
[
  {
    "id": 456,
    "title": {
      "rendered": "What is a virtual office?"
    },
    "acf": {
      "question": "What is a virtual office?",
      "answer": "<p>A virtual office provides businesses with...</p>",
      "show_on_home_page": true,
      "sort_order": 1
    }
  },
  {
    "id": 457,
    "title": {
      "rendered": "How much does it cost?"
    },
    "acf": {
      "question": "How much does it cost?",
      "answer": "<p>Our pricing starts at...</p>",
      "show_on_home_page": true,
      "sort_order": 2
    }
  }
]
```

### Frontend Integration Example

```typescript
// In client/src/lib/api/faqs.ts
interface FAQ {
  id: number;
  title: { rendered: string };
  acf: {
    question: string;
    answer: string;
    show_on_home_page: boolean;
    sort_order?: number;
  };
}

export function useHomepageFAQs() {
  return useQuery<FAQ[]>({
    queryKey: ['/api/faqs/homepage'],
  });
}

// Backend API route
app.get('/api/faqs/homepage', async (req, res) => {
  const wpUrl = process.env.WORDPRESS_API_URL;
  
  const response = await fetch(
    `${wpUrl}/wp-json/opus/v1/faqs/homepage?per_page=20`
  );
  const data = await response.json();
  
  res.json(data);
});
```

---

## 3. Popular Locations API

### Overview
Retrieves 8 random locations from the top 16 most popular locations for display on the homepage.

### WordPress Backend Requirements

#### Use Existing `location` CPT

#### Additional ACF Fields for Popular Locations

| Field Name | Field Key | Type | Required | Description |
|------------|-----------|------|----------|-------------|
| `location_image` | `field_location_image` | Image | Yes | Location thumbnail image |
| `popularity_score` | `field_popularity_score` | Number | Yes | Determines top 16 (higher = more popular) |
| `featured_on_homepage` | `field_featured_on_homepage` | True/False | No | Manual override for homepage feature |

### Endpoint

```
GET {WORDPRESS_URL}/wp-json/opus/v1/locations/popular
```

**Backend Logic Required:**
1. Query locations ordered by `popularity_score` DESC
2. Limit to top 16 results
3. Randomly select 8 from those 16
4. Return with location image, city name, and state abbreviation

**Query Parameters:**
- `count` - Number to return (default: 8)
- `seed` - Random seed for consistent results per session (optional)

**Example Request:**
```
GET /wp-json/opus/v1/locations/popular?count=8
```

**Expected Response Structure:**
```json
[
  {
    "id": 789,
    "city": "New York",
    "state": "NY",
    "image": {
      "url": "https://example.com/wp-content/uploads/nyc.jpg",
      "alt": "New York City skyline",
      "width": 800,
      "height": 600
    },
    "link": "https://example.com/locations/new-york-ny"
  },
  {
    "id": 790,
    "city": "Los Angeles",
    "state": "CA",
    "image": {
      "url": "https://example.com/wp-content/uploads/la.jpg",
      "alt": "Los Angeles downtown",
      "width": 800,
      "height": 600
    },
    "link": "https://example.com/locations/los-angeles-ca"
  }
  // ... 6 more locations
]
```

### Custom WordPress Endpoint Implementation

```php
// Add to theme's functions.php or custom plugin
add_action('rest_api_init', function () {
    register_rest_route('opus/v1', '/locations/popular', array(
        'methods' => 'GET',
        'callback' => 'get_popular_locations',
        'permission_callback' => '__return_true',
    ));
});

function get_popular_locations(WP_REST_Request $request) {
    $count = $request->get_param('count') ?? 8;
    
    // Get top 16 by popularity score
    $args = array(
        'post_type' => 'location',
        'posts_per_page' => 16,
        'orderby' => 'meta_value_num',
        'meta_key' => 'popularity_score',
        'order' => 'DESC',
    );
    
    $query = new WP_Query($args);
    $locations = array();
    
    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $image = get_field('location_image');
            
            $locations[] = array(
                'id' => get_the_ID(),
                'city' => get_field('city'),
                'state' => get_field('state'),
                'image' => array(
                    'url' => $image['url'],
                    'alt' => $image['alt'],
                    'width' => $image['width'],
                    'height' => $image['height'],
                ),
                'link' => get_permalink(),
            );
        }
    }
    
    wp_reset_postdata();
    
    // Randomly select 8 from the 16
    shuffle($locations);
    $locations = array_slice($locations, 0, $count);
    
    return rest_ensure_response($locations);
}
```

### Frontend Integration Example

```typescript
// In client/src/lib/api/locations.ts
interface PopularLocation {
  id: number;
  city: string;
  state: string;
  image: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
  link: string;
}

export function usePopularLocations() {
  return useQuery<PopularLocation[]>({
    queryKey: ['/api/locations/popular'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Backend API route
app.get('/api/locations/popular', async (req, res) => {
  const wpUrl = process.env.WORDPRESS_API_URL;
  
  const response = await fetch(
    `${wpUrl}/wp-json/opus/v1/locations/popular?count=8`
  );
  const data = await response.json();
  
  res.json(data);
});
```

---

## 4. Google Reviews API

### Overview
Retrieves Google Business reviews to display on the homepage.

### WordPress Backend Requirements

#### Custom Post Type: `google_review`
```php
register_post_type('google_review', array(
    'public' => true,
    'show_in_rest' => true,
    'rest_base' => 'reviews',
    'label' => 'Google Reviews',
));
```

#### Required ACF Fields

| Field Name | Field Key | Type | Required | Description |
|------------|-----------|------|----------|-------------|
| `rating` | `field_rating` | Number | Yes | Star rating (1-5) |
| `reviewer_name` | `field_reviewer_name` | Text | Yes | Name of reviewer |
| `review_text` | `field_review_text` | Textarea | Yes | Review content |
| `review_date` | `field_review_date` | Date | No | Date of review |
| `reviewer_image` | `field_reviewer_image` | Image | No | Reviewer profile photo |
| `show_on_homepage` | `field_show_on_homepage` | True/False | No | Feature on homepage |

### Endpoint

```
GET {WORDPRESS_URL}/wp-json/wp/v2/reviews?meta_key=show_on_homepage&meta_value=1
```

**Alternative custom endpoint:**
```
GET {WORDPRESS_URL}/wp-json/opus/v1/reviews/homepage
```

**Query Parameters:**
- `per_page` - Number of reviews (default: 10)
- `orderby` - Sort field (e.g., "date", "rating")
- `order` - Sort direction (asc/desc)

**Example Request:**
```
GET /wp-json/opus/v1/reviews/homepage?per_page=6&orderby=date&order=desc
```

**Expected Response Structure:**
```json
[
  {
    "id": 101,
    "acf": {
      "rating": 5,
      "reviewer_name": "John Smith",
      "review_text": "Excellent service! The virtual office solution helped our startup look professional from day one.",
      "review_date": "2024-10-15",
      "reviewer_image": {
        "url": "https://example.com/wp-content/uploads/john-smith.jpg",
        "alt": "John Smith"
      },
      "show_on_homepage": true
    }
  },
  {
    "id": 102,
    "acf": {
      "rating": 5,
      "reviewer_name": "Sarah Johnson",
      "review_text": "Great location and amazing staff. Highly recommend for any business needs.",
      "review_date": "2024-10-10",
      "reviewer_image": null,
      "show_on_homepage": true
    }
  }
]
```

### Frontend Integration Example

```typescript
// In client/src/lib/api/reviews.ts
interface Review {
  id: number;
  acf: {
    rating: number;
    reviewer_name: string;
    review_text: string;
    review_date?: string;
    reviewer_image?: {
      url: string;
      alt: string;
    };
    show_on_homepage: boolean;
  };
}

export function useGoogleReviews() {
  return useQuery<Review[]>({
    queryKey: ['/api/reviews'],
  });
}

// Backend API route
app.get('/api/reviews', async (req, res) => {
  const wpUrl = process.env.WORDPRESS_API_URL;
  
  const response = await fetch(
    `${wpUrl}/wp-json/opus/v1/reviews/homepage?per_page=6`
  );
  const data = await response.json();
  
  res.json(data);
});
```

---

## Environment Variables

Add the following to your `.env` file:

```env
# WordPress API Configuration
WORDPRESS_API_URL=https://your-wordpress-site.com

# Authentication (when determined)
# WORDPRESS_API_KEY=your-api-key
# WORDPRESS_API_SECRET=your-api-secret
```

For frontend access (if needed):
```env
# Must be prefixed with VITE_ for frontend access
VITE_WORDPRESS_API_URL=https://your-wordpress-site.com
```

---

## WordPress Backend Setup Checklist

### Required Plugins
- [ ] Advanced Custom Fields (ACF) Pro
- [ ] (Optional) ACF to REST API - if using ACF < 5.11

### Custom Post Types Setup
- [ ] Register `location` CPT with `show_in_rest => true`
- [ ] Register `faq` CPT with `show_in_rest => true`
- [ ] Register `google_review` CPT with `show_in_rest => true`

### ACF Field Groups Setup
- [ ] Create "Location Fields" group
  - [ ] Add all location fields (city, state, zip_code, etc.)
  - [ ] Enable "Show in REST API" in field group settings
  - [ ] Assign to `location` post type

- [ ] Create "FAQ Fields" group
  - [ ] Add question, answer, show_on_home_page fields
  - [ ] Enable "Show in REST API"
  - [ ] Assign to `faq` post type

- [ ] Create "Review Fields" group
  - [ ] Add rating, reviewer_name, review_text fields
  - [ ] Enable "Show in REST API"
  - [ ] Assign to `google_review` post type

### Custom REST Endpoints
- [ ] Create custom endpoint for location search (`/opus/v1/locations/search`)
- [ ] Create custom endpoint for popular locations (`/opus/v1/locations/popular`)
- [ ] Create custom endpoint for homepage FAQs (`/opus/v1/faqs/homepage`)
- [ ] Create custom endpoint for homepage reviews (`/opus/v1/reviews/homepage`)

### CORS Configuration
Add to WordPress `.htaccess` or `wp-config.php`:

```php
// Allow CORS for API requests
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
```

---

## Testing the API

### Using cURL

```bash
# Test location search
curl "https://your-wordpress-site.com/wp-json/wp/v2/locations?search=San+Diego"

# Test homepage FAQs
curl "https://your-wordpress-site.com/wp-json/opus/v1/faqs/homepage"

# Test popular locations
curl "https://your-wordpress-site.com/wp-json/opus/v1/locations/popular?count=8"

# Test reviews
curl "https://your-wordpress-site.com/wp-json/opus/v1/reviews/homepage"
```

### Using Postman
1. Create a new GET request
2. Enter the endpoint URL
3. Add query parameters as needed
4. Click Send
5. Verify response structure matches documentation

---

## Implementation Timeline

### Phase 1: Backend Setup (WordPress Developer)
1. Install and configure ACF Pro
2. Create custom post types
3. Create ACF field groups
4. Enable REST API for all CPTs and field groups
5. Create sample data for testing

### Phase 2: Custom Endpoints (WordPress Developer)
1. Implement `/opus/v1/locations/search` endpoint
2. Implement `/opus/v1/locations/popular` endpoint with randomization logic
3. Implement `/opus/v1/faqs/homepage` endpoint
4. Implement `/opus/v1/reviews/homepage` endpoint
5. Test all endpoints with Postman

### Phase 3: Frontend Integration (Frontend Developer)
1. Create API utility functions in `client/src/lib/api/`
2. Implement TanStack Query hooks for each endpoint
3. Update components to use real data:
   - `ActionSearchBar` for location search
   - FAQ accordion component
   - Popular locations grid
   - Google reviews section
4. Handle loading states and error cases
5. Test complete user flows

---

## Support and Questions

For questions about this API integration:
- **Frontend Issues**: Contact frontend development team
- **Backend Issues**: Contact WordPress development team
- **API Design**: Review this document or schedule integration meeting
