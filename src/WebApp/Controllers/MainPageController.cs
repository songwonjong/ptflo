using Framework;
using Microsoft.AspNetCore.Mvc;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Drawing;
using System.Dynamic;
using System.Transactions;
using static OfficeOpenXml.ExcelErrorValue;

namespace WebApp
{
    /// <summary>
    /// QnA 게시판 컨트롤러
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class MainPageController : ControllerBaseEx
    {
        public MainPageController(ILogger<QnaController> logger) : base(logger)
        {
        }

        [HttpGet]
        [Route("guestbookList")]
        public DataTableCollection guestbookList()
        {
            var ds = DataContext.StringDataSetEx(Setting.PsqlConn, "@MainPage.guestbookList");

            var ds1 = DataContext.StringDataSetEx(Setting.PsqlConn, "@MainPage.guestbookchartList");
            
            return ds.Tables;
        }
        [HttpGet]
        [Route("guestbookchartList")]
        public IEnumerable<IDictionary> guestbookchartList()
        {
            var ds = DataContext.StringDataSetEx(Setting.PsqlConn, "@MainPage.guestbookchartList");

            return ToList(ds.Tables[0]);
        }

        [HttpPut]
        [Route("guestbookInsert")]
        public int guestbookInsert(IDictionary<string, object> param)
        {
            RefineParam(param);

            return DataContext.StringNonQueryEx(Setting.PsqlConn, "@MainPage.guestbookInsert", param);
        }

        [HttpPut]
        [Route("guestbookUpdate")]
        public int guestbookUpdate(IDictionary<string, object> param)

        {
            RefineParam(param);

            return DataContext.StringNonQueryEx(Setting.PsqlConn, "@MainPage.guestbookUpdate", param);
        }

        [HttpPut]
        [Route("guestbookDelete")]
        public int guestbookDelete(IDictionary<string, object> param)

        {
            RefineParam(param);

            return DataContext.StringNonQueryEx(Setting.PsqlConn, "@MainPage.guestbookDelete", param);
        }
    }
}