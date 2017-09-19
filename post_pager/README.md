This reads in data from the mock ListItemCollection and in turn builds the interface that meats the functional requirements below.  It demonstrates different aspects of Backbone and also uses jQuery and underscore.  

There are a good amount of functional requirements that have to be met as shown below and they are all met.  There was some design decisions on my own part as far as look and feel and how it acts when deleting items.  I decided to try and go with a Bootstrap look and feel for the style.

**Functional Spec**

* General data about the list should be shown somewhere in the container:
    * Number of total list items
    * Number of "approved" posts
        * These are posts with `customer_approved` and `manager_approved` values equal to 1
    * Number of "pending" posts
        * These are posts with `customer_approved` or `manager_approved` (or both) equal to 0
    * Number of "rejected" posts
        * These are posts with `customer_approved` or `manager_approved` (or both) equal to -1
* There should be a PAGED, SORTABLE, SEARCHABLE list of scheduled posts:
    * Assume that you will always have a complete set of local data (don't worry about service calls)
    * Page limit of 5 items
    * Paging controls:
        * Next page
        * Previous page
        * Next/Previous buttons should be visible but appear disabled when not applicable (i.e., when on the first or last page)
    * Sort by:
        * `schedule` date (ascending and descending)
        * `created_at` date (ascending and descending)
        * `created_by_name` (ascending and descending)
    * Search by:
        * `message` text
        * `created_by_name`
* Scheduled Post List Items:
    * Should display at least the following information:
        * A single-line snippet of the message text
        * The date/time for which the post is scheduled
        * The network TYPE (i.e. facebook) for which the post is scheduled
        * Some kind of indication of its approval status
    * Should have the following interactions:
        * "Click" on a list item should bring up a small dialog box showing:
            * The full message text
            * The date/time for which the post is scheduled
            * The network TYPE (i.e. facebook) for which the post is scheduled
            * The network NAME
            * The network thumbnail
            * The date/time the post the date was created
            * The name of the person who created the post
            * An indication of its approval status
        * "Hover" on a list item should show a "delete" button
            * "Click" on the delete button should remove the post from both the collection and the list.
