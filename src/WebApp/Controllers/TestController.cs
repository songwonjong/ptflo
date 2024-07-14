using Framework;
using Microsoft.AspNetCore.Mvc;
using System.Collections;
using System.Collections.Specialized;
using System.Transactions;

namespace WebApp
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController: ControllerBaseEx
    {
        public TestController(ILogger<TestController> logger) : base(logger)
        {
        }

        [HttpGet]
        public IEnumerable<IDictionary> List([FromQuery] string useYn, string category)
        {

            var dic = new HybridDictionary();
            dic.Add("useYn", useYn);
            if (category != "ALL")
            {
                dic.Add("category", category);
            }
         
            var rtn = DataContext.StringDataSetEx(Setting.MesConn, "@Qna.QnaList", dic).Tables[0];

            return ToList(rtn);
        }

    }
}
