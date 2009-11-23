from cm.diff import text_diff as _text_diff, \
    text_history as inner_text_history, get_colors
from cm.message import display_message
from cm.models import Text, TextVersion, Attachment, Comment, Configuration
from cm.security import has_global_perm
from cm.utils.spannifier import spannify
from django import forms
from django.core.urlresolvers import reverse
from django.forms import ModelForm
from django.forms.util import ErrorList
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.utils.translation import ugettext as _, ugettext_lazy
from django.views.generic.list_detail import object_list
import mimetypes
import simplejson
import sys

def get_text_by_keys_or_404(key, adminkey=None):
    try:
        if not adminkey:
            return Text.objects.get(key=key)
        else:
            return Text.objects.get(key = key, adminkey = adminkey)
    except Text.DoesNotExist:
        raise Http404('No Text with such keys')

def get_keys_from_dict(dico, prefix):
    res = {}
    for k, v in dico.items():
        if k.startswith(prefix):
            key = k[len(prefix):]
            if key == u'_':
                key = None
            res[key] = v
    return res


def unauthorized(request):
    resp = render_to_response('site/unauthorized.html', context_instance=RequestContext(request))
    resp.status_code = 403
    return resp


def redirect(request, view_id, args):
    return HttpResponseRedirect(reverse(view_id, args=args))
