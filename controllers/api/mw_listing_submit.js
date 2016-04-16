/*
    Copyright (C) 2015  PencilBlue, LLC

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
module.exports = function(pb) {
    //pb depdencies
    var util = pb.util;

    function ListingSubmit() {};
    util.inherits(ListingSubmit, pb.BaseController);
    ListingSubmit.prototype.render = function(cb) {
        var self = this;
        this.getJSONPostParams(function(err, post) {
            var message = self.hasRequiredParams(post, ['description', 'location', 'role']);
            if(message) {
                cb({
                    code: 400,
                    content: pb.BaseController.apiResponse(pb.BaseController.API_ERROR, message, "Response 1")
                });
                return;
            }
            var cos = new pb.CustomObjectService();
            cos.loadTypeByName('mw_listing', function(err, contactType) {
                if(util.isError(err) || !util.isObject(contactType)) {
                    cb({
                        code: 400,
                        content: pb.BaseController.apiResponse(pb.BaseController.API_ERROR, self.ls.get('INVALID_UID'), "Response 2")
                    });
                    return;
                }
                var listing = {
                    name: util.uniqueId(),
                    id: util.uniqueId(),
                    description: post.description,
                    role: post.role,
                    location: post.location,
                    department: post.department,
                    short:post.short
                };
                pb.CustomObjectService.formatRawForType(listing, contactType);
                var customObjectDocument = pb.DocumentCreator.create('custom_object', listing);
                cos.save(customObjectDocument, contactType, function(err, result) {
                    if(util.isError(err)) {
                        return cb({
                            code: 500,
                            content: pb.BaseController.apiResponse(pb.BaseController.API_ERROR, self.ls.get('ERROR_SAVING'), "Response 3")
                        });
                    } else if(util.isArray(result) && result.length > 0) {
                        console.log("HELLLOOO!!!", result, err);
                        return cb({
                            code: 500,
                            content: pb.BaseController.apiResponse(pb.BaseController.API_ERROR, self.ls.get('ERROR_SAVING'))
                        });
                    }
                    cb({
                        content: pb.BaseController.apiResponse(pb.BaseController.API_SUCCESS, 'new listing submitted')
                    });
                });
            });
        });
    };
    ListingSubmit.getRoutes = function(cb) {
        var routes = [{
            method: 'post',
            path: '/api/listing/mw_listing_submit',
            auth_required: false,
            access_level: pb.SecurityService.ACCESS_WRITER,
            content_type: 'application/json'
        }];
        cb(null, routes);
    };
    //exports
    return ListingSubmit;
};