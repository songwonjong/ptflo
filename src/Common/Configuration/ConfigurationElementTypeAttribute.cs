// Copyright (c) Microsoft Corporation. All rights reserved. See License.txt in the project root for license information.

using System;
using Microsoft.Practices.EnterpriseLibrary.Common.Properties;

namespace Microsoft.Practices.EnterpriseLibrary.Common.Configuration
{
    /// <summary>
    /// Indicates the configuration object type that is used for the attributed object.
    /// </summary>
    [AttributeUsage(AttributeTargets.Class, AllowMultiple = false, Inherited = false)]
    public sealed class ConfigurationElementTypeAttribute : Attribute
    {
        //private Type configurationType;
        private string typeName;

        /// <summary>
        /// Initialize a new instance of the <see cref="Microsoft.Practices.EnterpriseLibrary.Common.Configuration.ConfigurationElementTypeAttribute"/> class.
        /// </summary>
        public ConfigurationElementTypeAttribute()
        {
        }

        /// <summary>
        /// Initialize a new instance of the <see cref="ConfigurationElementTypeAttribute"/> class with the configuration object type.
        /// </summary>
        /// <param name="configurationType">The <see cref="Type"/> of the configuration object.</param>
        public ConfigurationElementTypeAttribute(Type configurationType)
            : this(configurationType == null ? null : configurationType.AssemblyQualifiedName)
        {
        }

        /// <summary>
        /// Initialize a new instance of the <see cref="ConfigurationElementTypeAttribute"/> class with the configuration object type.
        /// </summary>
        /// <param name="typeName">The <see cref="Type"/> name of the configuration object.</param>
        public ConfigurationElementTypeAttribute(string typeName)
        {
            if (string.IsNullOrEmpty(typeName)) throw new ArgumentException(Resources.ExceptionStringNullOrEmpty, "typeName");
            this.typeName = typeName;
        }

        /// <summary>
        /// Gets the <see cref="Type"/> of the configuration object.
        /// </summary>
        /// <value>
        /// The <see cref="Type"/> of the configuration object.
        /// </value>
        public Type ConfigurationType
        {
            get { return Type.GetType(TypeName); }
        }

        /// <summary>
        /// Gets <see cref="Type"/> name of the configuration object.
        /// </summary>
        public string TypeName
        {
            get { return typeName; }
        }
    }
}

