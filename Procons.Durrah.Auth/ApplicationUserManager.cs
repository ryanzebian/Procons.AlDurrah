﻿namespace Procons.Durrah.Auth
{
    using Common;
    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.EntityFramework;
    using Microsoft.AspNet.Identity.Owin;
    using Microsoft.Owin;
    using Procons.Durrah.Facade;
    using System;
    using System.Security.Claims;
    using System.Threading.Tasks;
    using System.Web;

    public class ApplicationUserManager : UserManager<ApplicationUser>
    {
        IUserStore<ApplicationUser> _store;
        LoginFacade loginFacade = new LoginFacade();
        public ApplicationUserManager(IUserStore<ApplicationUser> store)
            : base(store)
        {
            _store = store;
        }

        public static ApplicationUserManager Create(IdentityFactoryOptions<ApplicationUserManager> options, IOwinContext context)
        {
            var appUserManager = new ApplicationUserManager(new UserStore<ApplicationUser>());
            appUserManager.UserValidator = new UserValidator<ApplicationUser>(appUserManager)
            {
                AllowOnlyAlphanumericUserNames = false,
                RequireUniqueEmail = true,
            };

            appUserManager.PasswordValidator = new PasswordValidator
            {
                RequiredLength = 4,
                RequireNonLetterOrDigit = false,
                RequireDigit = false,
                RequireLowercase = false,
                RequireUppercase = false,
            };

            //appUserManager.EmailService = new EmailService();

            var dataProtectionProvider = options.DataProtectionProvider;
            if (dataProtectionProvider != null)
            {
                appUserManager.UserTokenProvider = new DataProtectorTokenProvider<ApplicationUser>(dataProtectionProvider.Create("ASP.NET Identity"))
                {
                    TokenLifespan = TimeSpan.FromHours(6)
                };
            }

            return appUserManager;
        }


        public override Task<ApplicationUser> FindAsync(string userName, string password)
        {
            
            var user = loginFacade.FindUser(userName, password);
            return Task.FromResult(user);
        }

        public override Task<IdentityResult> CreateAsync(ApplicationUser user)
        {
           return Task.FromResult(loginFacade.CreateUser(user));
        }

        public override Task<ClaimsIdentity> CreateIdentityAsync(ApplicationUser user, string authenticationType)
        {
            ClaimsIdentity _claimsIdentity = new ClaimsIdentity();
            _claimsIdentity.AddClaim(new Claim(Common.Constants.ServiceLayer.UserName, user.UserName));
            _claimsIdentity.AddClaim(new Claim(Common.Constants.ServiceLayer.Email, user.Email));
            _claimsIdentity.AddClaim(new Claim("Type", user.UserType));
            _claimsIdentity.AddClaim(new Claim(Common.Constants.ServiceLayer.CardCode, user.CardCode));
            return Task.FromResult(_claimsIdentity);
        }

    }
}