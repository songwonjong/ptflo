using Framework;
using Microsoft.AspNetCore.Mvc;
using System.Collections;
using System.Dynamic;
using System.Transactions;

namespace WebApp
{
    /// <summary>
    /// QnA 게시판 컨트롤러
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class QnaController : ControllerBaseEx
    {
        public QnaController(ILogger<QnaController> logger) : base(logger)
        {
        }

        [HttpGet]
        public IEnumerable<IDictionary> List(char useYn, string? subject)
        {
            var ds = DataContext.StringDataSetEx(
                Setting.MesConn, "@Qna.QnaList", 
                new { useYn, subject } // Anonymous 타입 dynamic 파라미터 선언
            );

            return ToList(ds.Tables[0]);
        }

        [HttpGet]
        [Route("list")]
        public IEnumerable<IDictionary> List2()
        {
            var ds = DataContext.StringDataSetEx(Setting.MesConn, "@Qna.QnaList2");

            return ToList(ds.Tables[0]);
        }

        [HttpPut]
        public IActionResult Create(IDictionary<string, object> param)
        {
            RefineParam(param);

            return HandleResult(DataContext.StringNonQueryEx(Setting.MesConn, "@Qna.QnaInsert", param));
        }

        [HttpPost]
        public IActionResult Update(IDictionary<string, object> param)
        {
            RefineParam(param);

            return HandleResult(DataContext.StringNonQueryEx(Setting.MesConn, "@Qna.QnaUpdate", param));
        }

        [HttpPost]
        [Route("update2")]
        public IActionResult Update2(QnaEntity entity)
        {
            int rtn = 0;

            RefineEntity(entity);

            rtn += DataContext.StringNonQueryEx(Setting.ErpConn, "@Qna.QnaUpdateOracle", entity);

            rtn += DataContext.StringNonQueryEx(Setting.GroupwareConn, "@Qna.QnaUpdateMssql", entity);

            return HandleResult(rtn);
        }

        [HttpPost]
        [Route("multi")]
        public IActionResult Multi(QnaEntity entity)
        {
            return HandleResult(DataContext.StringNonQueryEx(Setting.MesConn, "@Qna.QnaUpdate", entity));
        }

        [HttpPost]
        [JsonParameters]
        [Route("update3")]
        public IActionResult Update3(int qnaNo, string? category, string status, string subject, string? body, char useYn)
        {
            dynamic entity = new ExpandoObject(); // ExpandoObject 타입 dynamic 파라미터
            entity.QnaNo = qnaNo;
            entity.Status = status;
            entity.Subject = subject;
            entity.Body = body;
            entity.UseYn = useYn;
            if (category != null)
                entity.Category = category;

            RefineExpando(entity);

            return HandleResult(DataContext.StringNonQueryEx(Setting.MesConn, "@Qna.QnaUpdate", entity));
        }

        [HttpPost]
        [Route("update4")]
        public IActionResult Update4(ExpandoObject entity)
        {
            RefineExpando(entity);

            dynamic entityDynamic = entity;
            entityDynamic.Test = "ㅋㅋㅋ";

            return HandleResult(DataContext.StringNonQueryEx(Setting.MesConn, "@Qna.QnaUpdate", entity));
        }

        [HttpPost]
        [Route("delete")]
        public IActionResult Delete(IEnumerable<IDictionary> list)
        {
            var rtn = 0;

            using (TransactionScope scope = new TransactionScope())
            {
                foreach (var param in list)
                {
                    rtn += DataContext.StringNonQueryEx(Setting.MesConn, "@Qna.QnaDelete", param);
                }

                scope.Complete();
            }

            return HandleResult(rtn);
        }
    }
}