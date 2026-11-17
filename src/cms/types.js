/** @typedef {{id:string, storage_path:string, public_url:string, alt_text:string, width:number, height:number, size_bytes:number, mime_type:string, focal_x:number, focal_y:number}} MediaAsset */
/** @typedef {{key:string, content:Record<string, unknown>, published_at:string|null, updated_at:string|null}} SiteSection */
/** @typedef {{id:string, slug:string, category:string, level:string, date:string, title:string, excerpt:string, body:string, image:string, imageAlt:string, featured:boolean, sortOrder:number}} NewsPost */
/** @typedef {{id:string, parent_name:string, email:string, phone:string, grade:string, campus:string, status:'not_contacted'|'to_contact'|'contacted'|'new_client'|'not_interested', read_at:string|null, notes:string, follow_up_at:string|null, last_contact_at:string|null, source:string, created_at:string, updated_at:string}} AdmissionRequest */

export const CMS_TYPES = Object.freeze({ MediaAsset: 'MediaAsset', SiteSection: 'SiteSection', NewsPost: 'NewsPost', AdmissionRequest: 'AdmissionRequest' })
