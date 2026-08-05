# Database Documentation
## Overview
This database supports an e-commerce platform with products, orders, blog posts, and user profiles.

## Tables

### addresses
| Column | Type | Nullable |
| --- | --- | --- |
| id | uuid | NO |
| user_id | uuid | NO |
| full_name | text | NO |
| line1 | text | NO |
| line2 | text | YES |
| city | text | NO |
| postal_code | text | NO |
| country | text | NO |
| phone | text | YES |
| is_default | boolean | NO |
| created_at | timestamp with time zone | NO |
| updated_at | timestamp with time zone | NO |

### blog_posts
| Column | Type | Nullable |
| --- | --- | --- |
| id | uuid | NO |
| slug | text | NO |
| title | text | NO |
| excerpt | text | YES |
| content | text | YES |
| cover_url | text | YES |
| author_id | uuid | YES |
| published | boolean | NO |
| published_at | timestamp with time zone | YES |
| created_at | timestamp with time zone | NO |
| updated_at | timestamp with time zone | NO |
| category | text | YES |

### categories
| Column | Type | Nullable |
| --- | --- | --- |
| id | uuid | NO |
| slug | text | NO |
| name | text | NO |
| description | text | YES |
| image_url | text | YES |
| sort_order | integer | NO |
| created_at | timestamp with time zone | NO |
| updated_at | timestamp with time zone | NO |

### contact_submissions
| Column | Type | Nullable |
| --- | --- | --- |
| id | uuid | NO |
| name | text | NO |
| email | text | NO |
| subject | text | YES |
| message | text | NO |
| status | text | NO |
| created_at | timestamp with time zone | NO |
| updated_at | timestamp with time zone | NO |

### favorites
| Column | Type | Nullable |
| --- | --- | --- |
| id | uuid | NO |
| user_id | uuid | NO |
| product_id | uuid | NO |
| created_at | timestamp with time zone | NO |

### order_items
| Column | Type | Nullable |
| --- | --- | --- |
| id | uuid | NO |
| order_id | uuid | NO |
| product_id | uuid | YES |
| product_name | text | NO |
| unit_price | numeric | NO |
| quantity | integer | NO |
| created_at | timestamp with time zone | NO |

### orders
| Column | Type | Nullable |
| --- | --- | --- |
| id | uuid | NO |
| user_id | uuid | NO |
| status | text | NO |
| total | numeric | NO |
| shipping_address | jsonb | YES |
| notes | text | YES |
| created_at | timestamp with time zone | NO |
| updated_at | timestamp with time zone | NO |

### products
| Column | Type | Nullable |
| --- | --- | --- |
| id | uuid | NO |
| slug | text | NO |
| name | text | NO |
| description | text | YES |
| price | numeric | NO |
| compare_at_price | numeric | YES |
| stock | integer | NO |
| category_id | uuid | YES |
| image_url | text | YES |
| images | jsonb | NO |
| is_active | boolean | NO |
| is_featured | boolean | NO |
| created_at | timestamp with time zone | NO |
| updated_at | timestamp with time zone | NO |

### profiles
| Column | Type | Nullable |
| --- | --- | --- |
| id | uuid | NO |
| email | text | YES |
| display_name | text | YES |
| avatar_url | text | YES |
| created_at | timestamp with time zone | NO |
| updated_at | timestamp with time zone | NO |
| phone | text | YES |
| address | text | YES |

### site_pages
| Column | Type | Nullable |
| --- | --- | --- |
| slug | text | NO |
| title | text | NO |
| content | text | NO |
| meta | jsonb | NO |
| updated_at | timestamp with time zone | NO |
| created_at | timestamp with time zone | NO |

### site_settings
| Column | Type | Nullable |
| --- | --- | --- |
| key | text | NO |
| value | jsonb | NO |
| updated_at | timestamp with time zone | NO |

### user_roles
| Column | Type | Nullable |
| --- | --- | --- |
| id | uuid | NO |
| user_id | uuid | NO |
| role | USER-DEFINED | NO |
| created_at | timestamp with time zone | NO |


## Relationships
| Table | Column | References |
| --- | --- | --- |