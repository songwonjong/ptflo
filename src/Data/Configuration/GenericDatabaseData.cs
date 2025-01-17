// Copyright (c) Microsoft Corporation. All rights reserved. See License.txt in the project root for license information.

using System;
using System.Configuration;
using System.Data.Common;
using Microsoft.Extensions.Logging;
using Microsoft.Practices.EnterpriseLibrary.Common.Configuration;

namespace Microsoft.Practices.EnterpriseLibrary.Data.Configuration
{
    /// <summary>
    /// Describes a <see cref="GenericDatabase"/> instance, aggregating information from a 
    /// <see cref="ConnectionStringSettings"/>.
    /// </summary>
    public class GenericDatabaseData : DatabaseData
    {
        ///<summary>
        /// Initializes a new instance of the <see cref="GenericDatabaseData"/> class with a connection string and a configuration
        /// source.
        ///</summary>
        ///<param name="connectionStringSettings">The <see cref="ConnectionStringSettings"/> for the represented database.</param>
        ///<param name="configurationSource">The <see cref="IConfigurationSource"/> from which additional information can 
        /// be retrieved if necessary.</param>
        ///<param name="sqlCache">Sql File Cache Handler</param>
        ///<param name="logger">Application Logger</param>
        public GenericDatabaseData(ConnectionStringSettings connectionStringSettings, Func<string, ConfigurationSection> configurationSource, ISqlCache sqlCache, ILogger logger)
            : base(connectionStringSettings, configurationSource, sqlCache, logger)
        {
        }

        /// <summary>
        /// Gets the name of the ADO.NET provider for the represented database.
        /// </summary>
        public string ProviderName
        {
            get { return ConnectionStringSettings.ProviderName; }
        }

        /// <summary>
        /// Builds the <see cref="Database" /> represented by this configuration object.
        /// </summary>
        /// <returns>
        /// A database.
        /// </returns>
        public override Database BuildDatabase()
        {
            return new GenericDatabase(this.ConnectionString, DbProviderFactories.GetFactory(this.ProviderName), this._sqlCache, this._logger);
        }
    }
}
