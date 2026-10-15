# Portfolio analytics

The portfolio uses the existing Umami Cloud website `98fe9c82-12aa-4e90-bfd2-1b02c32c5499`. Its public website ID is in the shared `index.html` template, so every generated page includes the same tracker. No API key or additional dependency is needed.

Umami automatically records the initial pageview and React Router history changes. Keep automatic tracking enabled; adding a second route tracker would duplicate pageviews. Hash links such as `#works`, `#contact`, and case-study sections are excluded from page URLs. Query parameters remain available for campaign attribution.

Tracking is restricted to `abisola.xyz` and `www.abisola.xyz`. Local development, Netlify previews, and Studio do not send analytics to this project. The tracker respects the browser's Do Not Track preference.

## Events

Names follow `element_action` in snake_case. Each event describes the specific click that occurred; project and location properties add context.

| Event | Trigger | Properties |
| --- | --- | --- |
| `all_projects_link_clicked` | Clicked All projects in Selected work | `location` |
| `project_image_clicked` | Clicked a featured project's image | `project` slug, `location` |
| `project_story_clicked` | Clicked Read the story on a featured project | `project` slug, `location` |
| `project_card_clicked` | Clicked a project card in the collection | `project` slug, `location` |
| `project_demo_clicked` | Clicked Visit product in a case study | `project` slug |
| `project_source_clicked` | Clicked View source in a case study | `project` slug |
| `contact_section_link_clicked` | Clicked Contact in navigation or Get in touch after a case study | `location`, `project` on case studies |
| `contact_email_clicked` | Clicked the email link in the footer | None |
| `github_profile_clicked` | Clicked GitHub in the footer | `platform` |
| `linkedin_profile_clicked` | Clicked LinkedIn in the footer | `platform` |

Event properties use fixed labels and published project slugs. Email addresses and destination URLs are not added as custom event properties. Events use Umami's native data attributes, keeping navigation independent of React analytics handlers.

## Verify after deployment

1. Sign into [Umami Cloud](https://cloud.umami.is/) and select the website matching the ID above. Pageviews appear in its website overview; custom events and their properties appear under Events.
2. On the production domain, open the home page, use All projects, then open a project. Confirm each visited page appears once. Section links should not create additional pageviews.
3. Click a product/source link, email link, and social link. Confirm the corresponding events and project/platform properties. An email click measures intent, not delivery of a message.
4. Check the browser Network panel for the tracker and collection requests. Browser tracking protection, ad blockers, or Do Not Track can prevent collection.

Local builds verify the tracker and event markup. Production receipt still needs the deployed domain and access to the existing Umami dashboard.

References: [tracker configuration](https://docs.umami.is/docs/tracker-configuration), [event attributes](https://docs.umami.is/docs/track-events).
