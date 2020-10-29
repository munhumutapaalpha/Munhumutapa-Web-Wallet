/******************************************************************************
 * Copyright © 2013-2016 The Nxt Core Developers.                             *
 * Copyright © 2016-2019 Jelurida IP B.V.                                     *
 *                                                                            *
 * See the LICENSE.txt file at the top-level directory of this distribution   *
 * for licensing information.                                                 *
 *                                                                            *
 * Unless otherwise agreed in a custom licensing agreement with Jelurida B.V.,*
 * no part of this software, including this file, may be copied, modified,    *
 * propagated, or distributed except according to the terms contained in the  *
 * LICENSE.txt file.                                                          *
 *                                                                            *
 * Removal or modification of this copyright notice is prohibited.            *
 *                                                                            *
 ******************************************************************************/

/**
 * @depends {nrs.js}
 * @depends {nrs.modals.js}
 */
var NRS = (function(NRS, $) {
	$("body").on("click", ".show_peer_modal_action", function(event) {
		event.preventDefault();
		if (NRS.fetchingModalData) {
			return;
		}
		NRS.fetchingModalData = true;
        var address = $(this).data("address");
        NRS.sendRequest("getPeer", { peer: address }, function(peer) {
			NRS.showPeerModal(peer);
		});
	});

    NRS.showPeerModal = function(peer) {
        try {
            var peerDetails = $.extend({}, peer);
            showPeerModalImpl(peerDetails);
        } finally {
            NRS.fetchingModalData = false;
        }
	};

    function showPeerModalImpl(peerDetails) {
        $("#peer_info").html(peerDetails.announcedAddress);
        peerDetails.state = NRS.getPeerState(peerDetails.state);
        if (peerDetails.lastUpdated) {
            peerDetails.lastUpdated = NRS.formatTimestamp(peerDetails.lastUpdated);
        }
        if (peerDetails.lastConnectAttempt) {
            peerDetails.lastConnectAttempt = NRS.formatTimestamp(peerDetails.lastConnectAttempt);
        }
        peerDetails.downloaded_formatted_html = NRS.formatVolume(peerDetails.downloadedVolume);
        delete peerDetails.downloadedVolume;
        peerDetails.uploaded_formatted_html = NRS.formatVolume(peerDetails.uploadedVolume);
        delete peerDetails.uploadedVolume;
        var detailsTable = $("#peer_details_table");
        detailsTable.find("tbody").empty().append(NRS.createInfoTable(peerDetails));
        detailsTable.show();
        $("#peer_modal").modal("show");
    }

	return NRS;
}(NRS || {}, jQuery));