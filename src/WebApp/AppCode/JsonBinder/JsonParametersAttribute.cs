namespace WebApp;

using Microsoft.AspNetCore.Mvc.ApplicationModels;
using Microsoft.AspNetCore.Mvc.ModelBinding;

public class JsonParametersAttribute : Attribute, IActionModelConvention
{
    public void Apply(ActionModel action)
    {
        foreach (var parameter in action.Parameters)
        {
            parameter.BindingInfo ??= new BindingInfo();
            parameter.BindingInfo.BinderType = typeof(JsonBinder);
        }
    }
}
