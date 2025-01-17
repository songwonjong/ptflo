// Copyright (c) Microsoft Corporation. All rights reserved. See License.txt in the project root for license information.

using System;
using System.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Practices.EnterpriseLibrary.Common.Configuration;
using Microsoft.Practices.EnterpriseLibrary.Data.Configuration;

namespace Microsoft.Practices.EnterpriseLibrary.Data.Sql.Configuration
{
    /// <summary>
    /// Describes a <see cref="SqlDatabase"/> instance, aggregating information from a 
    /// <see cref="ConnectionStringSettings"/>.
    /// </summary>
    public class SqlDatabaseData : DatabaseData
    {
        ///<summary>
        /// Initializes a new instance of the <see cref="SqlDatabase"/> class with a connection string and a configuration
        /// source.
        ///</summary>
        ///<param name="connectionStringSettings">The <see cref="ConnectionStringSettings"/> for the represented database.</param>
        ///<param name="configurationSource">The <see cref="IConfigurationSource"/> from which additional information can 
        /// be retrieved if necessary.</param>
        ///<param name="sqlCache">Sql File Cache Handler</param>
        ///<param name="logger">Application Logger</param>
        public SqlDatabaseData(ConnectionStringSettings connectionStringSettings, Func<string, ConfigurationSection> configurationSource, ISqlCache sqlCache, ILogger logger)
            : base(connectionStringSettings, configurationSource, sqlCache, logger)
        {
        }

        /// <summary>
        /// Builds the <see cref="Database" /> represented by this configuration object.
        /// </summary>
        /// <returns>
        /// A database.
        /// </returns>
        public override Database BuildDatabase()
        {
            return new SqlDatabase(this.ConnectionString, this._sqlCache, this._logger);
        }
    }
}
