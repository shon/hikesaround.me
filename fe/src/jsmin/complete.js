function PageVM(){var self=this;self.status=ko.observable("Save"),self.error=ko.observable()}function on_newprofile_success(resp){$("#newprofile-btn").attr("disabled",!0),pagevm.status("Please check your email for confirmation"),$.cookie("session_id",resp.result),window.location.assign("/dashboard")}function on_newprofile_err(resp){var resp=resp.responseJSON;pagevm.error(resp.result.msg),pagevm.status("Save")}function on_newprofile(){pagevm.error("");var url=apihost+"/api/biz/signup/complete",data=form2json("#profile-form");data.token=window.location.hash.slice(1),apipost(url,data,on_newprofile_success,on_newprofile_err)}var pagevm=new PageVM;$("#profile-form").submit(function(event){return pagevm.status("Saving profile.."),on_newprofile(),!1}),window.onload=function(){ko.applyBindings(pagevm)};