namespace WebApp;

using System;
using System.Collections;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

using Framework;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;

public interface IAuthService
{
    UserEntity? Authenticate(IDictionary<string, object> param);
}

public class AuthService : BaseService, IAuthService
{
    readonly string _authKey;

    public AuthService(IOptions<Setting> app)
    {
        _authKey = app.Value.AuthKey;
    }

    public UserEntity? Authenticate(IDictionary<string, object> param)
    {
        var user = UserService.LoginSelect(param);

        if (user == null)
            return null;

        string token = CreateToken(user);

        user.Token = token;

        return user;
    }

    private string CreateToken(UserEntity user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();

        var identity = new ClaimsIdentity(new List<Claim>()
        {
            //new Claim("CorpCode", user.CorpCode),
            new Claim("UserId", user.UserId),
            //new Claim("MenuAuth", JsonConvert.SerializeObject(user.MenuAuthDic))
        });

        var descriptor = new SecurityTokenDescriptor()
        {
            Subject = identity,
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_authKey)),
                SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(descriptor);

        return tokenHandler.WriteToken(token);
    }
}
