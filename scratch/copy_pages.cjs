const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..', 'resources', 'js', 'pages');
const compDir = path.join(__dirname, '..', 'resources', 'js', 'components');

const filesToCopy = [
    [path.join(baseDir, 'Admin', 'AdminAnnouncement.jsx'), path.join(baseDir, 'Admin', 'AdminFeaturedAlumni.jsx')],
    [path.join(baseDir, 'Admin', 'AdminAnnouncementCreate.jsx'), path.join(baseDir, 'Admin', 'AdminFeaturedAlumniCreate.jsx')],
    [path.join(baseDir, 'Admin', 'AdminAnnouncementEdit.jsx'), path.join(baseDir, 'Admin', 'AdminFeaturedAlumniEdit.jsx')],
    [path.join(baseDir, 'Admin', 'AdminAnnouncementView.jsx'), path.join(baseDir, 'Admin', 'AdminFeaturedAlumniView.jsx')],
    [path.join(baseDir, 'Coordinator', 'CoordinatorAnnouncement.jsx'), path.join(baseDir, 'Coordinator', 'CoordinatorFeaturedAlumni.jsx')],
    [path.join(baseDir, 'Coordinator', 'CoordinatorAnnouncementCreate.jsx'), path.join(baseDir, 'Coordinator', 'CoordinatorFeaturedAlumniCreate.jsx')],
    [path.join(baseDir, 'Coordinator', 'CoordinatorAnnouncementEdit.jsx'), path.join(baseDir, 'Coordinator', 'CoordinatorFeaturedAlumniEdit.jsx')],
    [path.join(baseDir, 'Coordinator', 'CoordinatorAnnouncementView.jsx'), path.join(baseDir, 'Coordinator', 'CoordinatorFeaturedAlumniView.jsx')],
    // Let's also copy the components
    [path.join(compDir, 'admin', 'AdminAnnouncementCard.jsx'), path.join(compDir, 'admin', 'AdminFeaturedAlumniCard.jsx')],
    [path.join(compDir, 'admin', 'AdminAnnouncementDeletePromptandConfirmation.jsx'), path.join(compDir, 'admin', 'AdminFeaturedAlumniDeletePromptandConfirmation.jsx')],
    [path.join(compDir, 'coordinator', 'CoordinatorAnnouncementCard.jsx'), path.join(compDir, 'coordinator', 'CoordinatorFeaturedAlumniCard.jsx')],
    [path.join(compDir, 'coordinator', 'CoordinatorAnnouncementDeletePromptandConfirmation.jsx'), path.join(compDir, 'coordinator', 'CoordinatorFeaturedAlumniDeletePromptandConfirmation.jsx')],
];

filesToCopy.forEach(([src, dst]) => {
    let content = fs.readFileSync(src, 'utf-8');

    content = content.replace(/'admin\.announcement\.index'/g, "'admin.featured-alumni.index'");
    content = content.replace(/'admin\.announcement\.create'/g, "'admin.featured-alumni.create'");
    content = content.replace(/'admin\.announcement\.store'/g, "'admin.featured-alumni.store'");
    content = content.replace(/'admin\.announcement\.show'/g, "'admin.featured-alumni.show'");
    content = content.replace(/'admin\.announcement\.edit'/g, "'admin.featured-alumni.edit'");
    content = content.replace(/'admin\.announcement\.update'/g, "'admin.featured-alumni.update'");
    content = content.replace(/'admin\.announcement\.destroy'/g, "'admin.featured-alumni.destroy'");
    content = content.replace(/'admin\.announcement\.approve'/g, "'admin.featured-alumni.approve'");
    content = content.replace(/'admin\.announcement\.reject'/g, "'admin.featured-alumni.reject'");

    content = content.replace(/'coordinator\.announcement\.index'/g, "'coordinator.featured-alumni.index'");
    content = content.replace(/'coordinator\.announcement\.create'/g, "'coordinator.featured-alumni.create'");
    content = content.replace(/'coordinator\.announcement\.store'/g, "'coordinator.featured-alumni.store'");
    content = content.replace(/'coordinator\.announcement\.show'/g, "'coordinator.featured-alumni.show'");
    content = content.replace(/'coordinator\.announcement\.edit'/g, "'coordinator.featured-alumni.edit'");
    content = content.replace(/'coordinator\.announcement\.update'/g, "'coordinator.featured-alumni.update'");
    content = content.replace(/'coordinator\.announcement\.destroy'/g, "'coordinator.featured-alumni.destroy'");

    content = content.replace(/Announcements/g, "Featured Alumni");
    content = content.replace(/Announcement/g, "Featured Alumni");
    content = content.replace(/announcements/g, "featuredAlumni");
    content = content.replace(/announcement/g, "featuredAlumni");
    
    // Fix imports
    content = content.replace(/AdminFeatured Alumni/g, "AdminFeaturedAlumni");
    content = content.replace(/CoordinatorFeatured Alumni/g, "CoordinatorFeaturedAlumni");
    content = content.replace(/Featured AlumniCard/g, "FeaturedAlumniCard");
    content = content.replace(/Featured AlumniDeletePromptandConfirmation/g, "FeaturedAlumniDeletePromptandConfirmation");

    fs.writeFileSync(dst, content, 'utf-8');
});

console.log("Done!");
