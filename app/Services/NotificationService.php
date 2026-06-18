<?php

namespace App\Services;

use App\Events\NotificationCreated;
use App\Models\Notification;

class NotificationService
{
    public static function send(
        string $type,
        string $targetRole,
        string $title,
        string $message,
        array $data = [],
        ?int $triggeredBy = null,
        ?int $targetUserId = null   // for coordinator-specific notifs
    ): Notification {
        $notification = Notification::create([
            'type'           => $type,
            'target_role'    => $targetRole,
            'title'          => $title,
            'message'        => $message,
            'data'           => $data,
            'triggered_by'   => $triggeredBy,
            'target_user_id' => $targetUserId,
        ]);

        broadcast(new NotificationCreated($notification))->toOthers();

        return $notification;
    }

    // ── Alumni answered a survey ──────────────────────────────
    public static function surveyAnswered(int $surveyId, int $alumniId, string $alumniName): Notification
    {
        return self::send(
            type: 'survey_answered',
            targetRole: 'all',          // admin + coordinator
            title: 'New Survey Response',
            message: "{$alumniName} has submitted a survey response.",
            data: ['survey_id' => $surveyId, 'alumni_id' => $alumniId],
            triggeredBy: $alumniId,
        );
    }

    // ── Alumni registered ─────────────────────────────────────
    public static function alumniRegistered(int $alumniId, string $alumniName): Notification
    {
        return self::send(
            type: 'alumni_registered',
            targetRole: 'all',          // admin + coordinator
            title: 'New Alumni Registered',
            message: "{$alumniName} has created an account.",
            data: ['alumni_id' => $alumniId],
            triggeredBy: $alumniId,
        );
    }

    // ── Alumni sent an inquiry ────────────────────────────────
    public static function inquiryReceived(int $inquiryId, string $alumniName, int $alumniId): Notification
    {
        return self::send(
            type: 'inquiry_received',
            targetRole: 'all',          // admin + coordinator
            title: 'New Inquiry',
            message: "{$alumniName} sent an inquiry.",
            data: ['inquiry_id' => $inquiryId],
            triggeredBy: $alumniId,
        );
    }

    // ── Coordinator submitted an announcement (admin reviews) ─
    public static function announcementPendingReview(int $announcementId, string $announcementTitle, int $coordinatorId, string $coordinatorName): Notification
    {
        return self::send(
            type: 'announcement_pending',
            targetRole: 'admin',        // admin only
            title: 'Announcement Needs Review',
            message: "{$coordinatorName} submitted an announcement: \"{$announcementTitle}\".",
            data: ['announcement_id' => $announcementId, 'coordinator_id' => $coordinatorId],
            triggeredBy: $coordinatorId,
        );
    }

    // ── Admin approved an announcement ────────────────────────
    public static function announcementApproved(int $announcementId, string $announcementTitle, int $coordinatorId): Notification
    {
        return self::send(
            type: 'announcement_approved',
            targetRole: 'coordinator_specific',  // only the coordinator who submitted
            title: 'Announcement Approved',
            message: "Your announcement \"{$announcementTitle}\" has been approved.",
            data: ['announcement_id' => $announcementId],
            triggeredBy: auth()->check() ? auth()->user()->id : null,
            targetUserId: $coordinatorId,        // only this coordinator sees it
        );
    }

    // ── Admin rejected an announcement ────────────────────────
    public static function announcementRejected(int $announcementId, string $announcementTitle, int $coordinatorId, string $reason = ''): Notification
    {
        return self::send(
            type: 'announcement_rejected',
            targetRole: 'coordinator_specific',
            title: 'Announcement Rejected',
            message: "Your announcement \"{$announcementTitle}\" was rejected." . ($reason ? " Reason: {$reason}" : ''),
            data: ['announcement_id' => $announcementId, 'reason' => $reason],
            triggeredBy: auth()->check() ? auth()->user()->id : null,
            targetUserId: $coordinatorId,
        );
    }

        // ── Admin sent announcement back for revision ─────────────
    public static function announcementNeedsRevision(int $announcementId, string $announcementTitle, int $coordinatorId, string $note): Notification
    {
        return self::send(
            type: 'announcement_revision',
            targetRole: 'coordinator_specific',
            title: 'Announcement Needs Revision',
            message: "Your announcement \"{$announcementTitle}\" needs revision. Note: {$note}",
            data: ['announcement_id' => $announcementId, 'note' => $note],
            triggeredBy: auth()->id(),
            targetUserId: $coordinatorId,
        );
    }

    // ── Coordinator resubmitted revised announcement ──────────
    public static function announcementResubmitted(int $announcementId, string $announcementTitle, int $coordinatorId, string $coordinatorName): Notification
    {
        return self::send(
            type: 'announcement_resubmitted',
            targetRole: 'admin',
            title: 'Announcement Resubmitted',
            message: "{$coordinatorName} resubmitted the announcement \"{$announcementTitle}\" for review.",
            data: ['announcement_id' => $announcementId, 'coordinator_id' => $coordinatorId],
            triggeredBy: $coordinatorId,
        );
    }
}