gNewReplyHost = null ;
gNewReply = null

instanciateNewReplyForm = function(iCommentToAppendTo) {
	
	if (gNewReply == null) {
		gNewReply = {
				'val': {
					'name':gPrefs.get('user','name'),
					'email':gPrefs.get('user','email'), 
					'title':'', 
					'content':'',
					'tags':''},
				'ids': {
					'name':gPrefs.get('user','name'),
					'email':gPrefs.get('user','email'), 
					'title':'', 
					'content':'',
					'tags':'',
					'formId':CY.guid(),
					'nameInputId':CY.guid(),
					'emailInputId':CY.guid(),
					'titleInputId':CY.guid(),
					'contentInputId':CY.guid(),
					'keyInputId':CY.guid(),
					'formatInputId':CY.guid(),
					'tagsInputId':CY.guid(),
					'parentCommentId':CY.guid(),
					'addBtnId':CY.guid(),
					'cancelBtnId':CY.guid()},
				'handlers':{}
				} ;
	}

	gNewReplyHost = iCommentToAppendTo ;

	var headerHtml = '<hr/><center><div class="c-header-title">' + gettext('New reply') + '</div></center>' ;
	var html = gFormHtml['formStart'].replace('###', gNewReply['ids']['formId']) ;
	if (!sv_loggedIn) {
		html = html + gFormHtml['nameInput'].replace('###', gNewReply['ids']['nameInputId']) + gFormHtml['emailInput'].replace('###', gNewReply['ids']['emailInputId']) ;
	}
	html = html + gFormHtml['titleInput'].replace('###', gNewReply['ids']['titleInputId']) + gFormHtml['contentInput'].replace('###', gNewReply['ids']['contentInputId']) + gFormHtml['tagsInput'].replace('###', gNewReply['ids']['tagsInputId']);
	html = html + gFormHtml['hidden'].replace('###', gNewReply['ids']['keyInputId']).replace('???', 'comment_key') ;
	html = html + gFormHtml['hidden'].replace('###', gNewReply['ids']['formatInputId']).replace('???', 'format') ;
	html = html + gFormHtml['hidden'].replace('###', gNewReply['ids']['parentCommentId']).replace('???', 'reply_to_id') ;
	var btnsHtml =   gFormHtml['btns'].replace('###', gNewReply['ids']['addBtnId']).replace('???', gNewReply['ids']['cancelBtnId']) ;
	
	gNewReplyHost['overlay'].setStdModContent(CY.WidgetStdMod.FOOTER, headerHtml + html + btnsHtml) ;
	var replyNode = gNewReplyHost['overlay'].getStdModNode(CY.WidgetStdMod.FOOTER) ;

	var comment = gDb.getComment(iCommentToAppendTo.commentId) ;
	var REPLYPREF = "Re: " ;
	var newReplyTitle = (gNewReply['val']['title'] == "" || gNewReply['val']['title'].substring(0, REPLYPREF.length) == REPLYPREF) ? REPLYPREF + comment['title'] : gNewReply['val']['title'] ;

	if (!sv_loggedIn) {
		replyNode.query('.n_name').set('value', gNewReply['val']['name']) ;
		replyNode.query('.n_email').set('value', gNewReply['val']['email']) ;
	}
	replyNode.query('.n_title').set('value', newReplyTitle) ;
	replyNode.query('.n_content').set('value', gNewReply['val']['content']) ;
	replyNode.query('.n_tags').set('value', gNewReply['val']['tags']) ;
	
	replyNode.query('#'+gNewReply['ids']['parentCommentId']).set('value', iCommentToAppendTo['commentId']) ;
	replyNode.query('#'+gNewReply['ids']['formatInputId']).set('value', gConf['defaultCommentFormat']) ;
	         
	gNewReplyHost['overlay'].get('contentBox').query(".c-reply").addClass('displaynone') ;

	gNewReply['handlers']['addBtnId'] = CY.on("click", onAddNewReplyClick, "#"+gNewReply['ids']['addBtnId']);
	gNewReply['handlers']['cancelBtnId'] = CY.on("click", onCancelNewReplyClick, "#"+gNewReply['ids']['cancelBtnId']);
	
	var width = gLayout.getTopICommentsWidth() ;
	changeFormFieldsWidth(gNewReply['ids']['formId'], width) ;
}
cleanNewReplyForm = function() {
	if (gNewReplyHost != null) {
		var replyNode = gNewReplyHost['overlay'].getStdModNode(CY.WidgetStdMod.FOOTER) ;
		replyNode.queryAll('.comment_input').set('value','') ;
	}
}
cancelNewReplyForm = function() {
	if (gNewReplyHost != null) {
		
		// DETACH EVENT HANDLERS
		for (var id in gNewReply['handlers']) {
			if (gNewReply['handlers'][id] != null) {
				gNewReply['handlers'][id].detach() ;
				gNewReply['handlers'][id] = null ;
			}
		}

		gNewReplyHost['overlay'].get('contentBox').query(".c-reply").removeClass('displaynone') ;
		
		var footer = gNewReplyHost['overlay'].getStdModNode(CY.WidgetStdMod.FOOTER) ;
		if (!sv_loggedIn) {
			gNewReply['val']['name'] = footer.query('.n_name').get('value') ;
			gNewReply['val']['email'] = footer.query('.n_email').get('value') ;
		}
		gNewReply['val']['title'] = footer.query('.n_title').get('value') ;
		gNewReply['val']['content'] = footer.query('.n_content').get('value') ;
		gNewReply['val']['tags'] = footer.query('.n_tags').get('value') ;
		
		footer.set('innerHTML', '') ;
		
		gNewReplyHost = null ;
	}
}
// event triggered
onAddNewReplyClick = function() {
	if (!sv_loggedIn) {
		var name = CY.get("#"+gNewReply['ids']['nameInputId']).get('value') ;
		gPrefs.persist("user", "name", name) ;	
	
		var email = CY.get("#"+gNewReply['ids']['emailInputId']).get('value') ;
		gPrefs.persist("user", "email", email) ;
	}
	
	gSync.saveComment(gNewReply['ids']['formId']) ;
}
onCancelNewReplyClick = function() {
	gSync.cancelReply() ;
}
