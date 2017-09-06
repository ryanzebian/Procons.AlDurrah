﻿namespace Procons.Durrah.Api.Controllers
{
    using Common;
    using e24PaymentPipeLib;
    using System;
    using System.Collections.Generic;
    using System.Net;
    using System.Net.Http;
    using System.Security.Claims;
    using System.Web.Http;
    using System.Linq;
    using Facade;
    using System.Web;

    public class WorkersController : ApiController
    {
        B1Facade b1Facade = Factory.DeclareClass<B1Facade>();
        WorkersFacade workersFacade = Factory.DeclareClass<WorkersFacade>();
        public IHttpActionResult GetSearchLookups()
        {

            Dictionary<string, List<LookupItem>> result = new Dictionary<string, List<LookupItem>>();
            List<LookupItem> languages = workersFacade.GetLanguagesLookups();
            List<LookupItem> age = new List<LookupItem>() { new LookupItem("18-25", "18-25"), new LookupItem("25-35", "25-35") , new LookupItem("35-45", "35-45") , new LookupItem("45-55", "45-55") };
            List<LookupItem> nationality = workersFacade.GetCountriesLookups();
            List<LookupItem> gender = new List<LookupItem>() { new LookupItem("Male", "M"), new LookupItem("Female", "F") };
            List<LookupItem> maritalStatus = workersFacade.GetMaritalStatusLookups();
            List<LookupItem> workerTypes = workersFacade.GetWorkersTypesLookups();
            result.Add("Languages", languages);
            result.Add("Nationality", nationality);
            result.Add("Gender", gender);
            result.Add("MaritalStatus", maritalStatus);
            result.Add("WorkerTypes", workerTypes);

            return Ok(result);
        }

        [HttpPost]
        public HttpResponseMessage CallKnetGateway([FromBody]Transaction transaction)
        {
            short TransVal;
            string varPaymentID, varPaymentPage, varErrorMsg, varRawResponse;

            var claims = ((ClaimsIdentity)User.Identity).Claims;
            //var cardCode = claims.Where(x => x.Type == Constants.ServiceLayer.UserName).FirstOrDefault().Value;

            transaction.TrackID = (new Random().Next(10000000) + 1).ToString();

            e24PaymentPipeCtlClass payment = new e24PaymentPipeCtlClass();
            payment.Action = "1";
            payment.Amt = transaction.Amount;
            payment.Currency = "414";
            payment.Language = "USA";
            payment.ResponseUrl = Utilities.GetConfigurationValue(Constants.ConfigurationKeys.ResponseUrl);
            payment.ErrorUrl = Utilities.GetConfigurationValue(Constants.ConfigurationKeys.ErrorUrl);
            payment.TrackId = transaction.TrackID;
            payment.ResourcePath = Utilities.GetConfigurationValue(Constants.ConfigurationKeys.ResourcePath);
            payment.Alias = Utilities.GetConfigurationValue(Constants.ConfigurationKeys.Alias); ;
            payment.Udf1 = "User Defined Field 1";
            payment.Udf2 = "User Defined Field 2";
            payment.Udf3 = "User Defined Field 3";
            payment.Udf4 = "User Defined Field 4";
            payment.Udf5 = "User Defined Field 5";

            TransVal = payment.PerformInitTransaction();
            varRawResponse = payment.RawResponse;
            varPaymentID = payment.PaymentId;
            varPaymentPage = payment.PaymentPage;
            varErrorMsg = payment.ErrorMsg;
            transaction.PaymentID = varPaymentID;

            if (TransVal != 0)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "/Error");
            }
            else
            {
                //var result = workersFacade.CreateSalesOrder(transaction);
                //if (result == 0)
                //    return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "/Error");
                //else
                //    return Request.CreateResponse(HttpStatusCode.OK, varPaymentPage + "?PaymentID=" + varPaymentID);

                return Request.CreateResponse(HttpStatusCode.OK, varPaymentPage + "?PaymentID=" + varPaymentID);
            }

        }

        [HttpPost]
        public HttpResponseMessage CreatePayment([FromBody]Transaction payment)
        {

            var result = workersFacade.SavePaymentDetails(payment);
            if (result)
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Transaction failed!!!");
            else
                return Request.CreateResponse(HttpStatusCode.OK, "Transaction created successfully!!!");
        }

        [HttpPost]
        public IHttpActionResult GetAgentWorkers([FromBody]Worker worker)
        {
            var claims = ((ClaimsIdentity)User.Identity).Claims;
            var cardCode = claims.Where(x => x.Type == worker.Agent).FirstOrDefault().Value;
            //workersFacade.GetAgentWorkers(cardCode);
            return Ok();
        }

        [HttpPost]
        public IHttpActionResult GetWorkers([FromBody]Catalogue worker)
        {
            var workers = workersFacade.GetWorkers(worker);
            return Ok(workers);
        }

        [HttpPost]
        public IHttpActionResult AddWorker([FromBody]Worker worker)
        {
            var result = workersFacade.CreateWorker(worker);
            return Ok(result);
        }

        [HttpPost]
        public IHttpActionResult DeleteWorker(string code)
        {
            return Ok();
        }
    }
}