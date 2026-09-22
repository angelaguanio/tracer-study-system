import os
import shutil

base_dir = r"d:\Github\tracer-study-system\resources\js\pages"

files_to_copy = [
    (rf"{base_dir}\Admin\AdminAnnouncement.jsx", rf"{base_dir}\Admin\AdminFeaturedAlumni.jsx"),
    (rf"{base_dir}\Admin\AdminAnnouncementCreate.jsx", rf"{base_dir}\Admin\AdminFeaturedAlumniCreate.jsx"),
    (rf"{base_dir}\Admin\AdminAnnouncementEdit.jsx", rf"{base_dir}\Admin\AdminFeaturedAlumniEdit.jsx"),
    (rf"{base_dir}\Admin\AdminAnnouncementView.jsx", rf"{base_dir}\Admin\AdminFeaturedAlumniView.jsx"),
    (rf"{base_dir}\Coordinator\CoordinatorAnnouncement.jsx", rf"{base_dir}\Coordinator\CoordinatorFeaturedAlumni.jsx"),
    (rf"{base_dir}\Coordinator\CoordinatorAnnouncementCreate.jsx", rf"{base_dir}\Coordinator\CoordinatorFeaturedAlumniCreate.jsx"),
    (rf"{base_dir}\Coordinator\CoordinatorAnnouncementEdit.jsx", rf"{base_dir}\Coordinator\CoordinatorFeaturedAlumniEdit.jsx"),
    (rf"{base_dir}\Coordinator\CoordinatorAnnouncementView.jsx", rf"{base_dir}\Coordinator\CoordinatorFeaturedAlumniView.jsx"),
]

for src, dst in files_to_copy:
    shutil.copy(src, dst)
    
    with open(dst, 'r', encoding='utf-8') as f:
        content = f.read()

    # Precise route string replacements
    content = content.replace("'admin.announcement.index'", "'admin.featured-alumni.index'")
    content = content.replace("'admin.announcement.create'", "'admin.featured-alumni.create'")
    content = content.replace("'admin.announcement.store'", "'admin.featured-alumni.store'")
    content = content.replace("'admin.announcement.show'", "'admin.featured-alumni.show'")
    content = content.replace("'admin.announcement.edit'", "'admin.featured-alumni.edit'")
    content = content.replace("'admin.announcement.update'", "'admin.featured-alumni.update'")
    content = content.replace("'admin.announcement.destroy'", "'admin.featured-alumni.destroy'")
    content = content.replace("'admin.announcement.approve'", "'admin.featured-alumni.approve'")
    content = content.replace("'admin.announcement.reject'", "'admin.featured-alumni.reject'")

    content = content.replace("'coordinator.announcement.index'", "'coordinator.featured-alumni.index'")
    content = content.replace("'coordinator.announcement.create'", "'coordinator.featured-alumni.create'")
    content = content.replace("'coordinator.announcement.store'", "'coordinator.featured-alumni.store'")
    content = content.replace("'coordinator.announcement.show'", "'coordinator.featured-alumni.show'")
    content = content.replace("'coordinator.announcement.edit'", "'coordinator.featured-alumni.edit'")
    content = content.replace("'coordinator.announcement.update'", "'coordinator.featured-alumni.update'")
    content = content.replace("'coordinator.announcement.destroy'", "'coordinator.featured-alumni.destroy'")

    # UI text replacements
    content = content.replace("Announcements", "Featured Alumni")
    content = content.replace("Announcement", "Featured Alumni")
    content = content.replace("announcements", "featuredAlumni")
    content = content.replace("announcement", "featuredAlumni")
    
    # Component name replacements (since we replaced Announcement with Featured Alumni, we need to fix the imports and component definitions)
    content = content.replace("AdminFeatured Alumni", "AdminFeaturedAlumni")
    content = content.replace("CoordinatorFeatured Alumni", "CoordinatorFeaturedAlumni")
    content = content.replace("Featured AlumniCard", "FeaturedAlumniCard")
    content = content.replace("Featured AlumniDeletePromptandConfirmation", "FeaturedAlumniDeletePromptandConfirmation")

    with open(dst, 'w', encoding='utf-8') as f:
        f.write(content)

print("Pages copied and modified.")
