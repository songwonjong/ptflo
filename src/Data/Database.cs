// Copyright (c) Microsoft Corporation. All rights reserved. See License.txt in the project root for license information.

using System;
using System.Linq;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Data;
using System.Data.Common;
using System.Globalization;
using System.Transactions;
using Microsoft.Practices.EnterpriseLibrary.Data.Properties;
using System.Reflection;
using System.Xml.Linq;
using System.Text.RegularExpressions;
using System.ComponentModel;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using Microsoft.Practices.EnterpriseLibrary.Data.Extensions;
using System.Dynamic;
using System.Runtime.CompilerServices;
using System.Text;
using System.Diagnostics;
using Microsoft.Extensions.Logging;

namespace Microsoft.Practices.EnterpriseLibrary.Data
{
    /// <summary>
    /// Represents an abstract database that commands can be run against. 
    /// </summary>
    /// <remarks>
    /// The <see cref="Database"/> class leverages the provider factory model from ADO.NET. A database instance holds 
    /// a reference to a concrete <see cref="DbProviderFactory"/> object to which it forwards the creation of ADO.NET objects.
    /// </remarks>
    public abstract class Database
    {
        static ISqlCache _sqlCache;
        static ILogger _logger;

        public static readonly string Development = "Development";
        public static readonly string Staging = "Staging";
        public static readonly string Production = "Production";

        static readonly ParameterCache parameterCache = new ParameterCache();
        static readonly string VALID_PASSWORD_TOKENS = Resources.Password;
        static readonly string VALID_USER_ID_TOKENS = Resources.UserName;

        readonly ConnectionString connectionString;
        readonly DbProviderFactory dbProviderFactory;

        /// <summary>
        /// Checks if the current hosting environment name is "Development".
        /// </summary>
        /// <returns>True if the environment name is "Development", otherwise false.</returns>
        public static bool IsDevelopment()
        {
            return IsEnvironment(Development);
        }

        /// <summary>
        /// Checks if the current hosting environment name is "Staging".
        /// </summary>
        /// <returns>True if the environment name is "Staging", otherwise false.</returns>
        public static bool IsStaging()
        {
            return IsEnvironment(Staging);
        }

        /// <summary>
        /// Checks if the current hosting environment name is "Production".
        /// </summary>
        /// <returns>True if the environment name is "Production", otherwise false.</returns>
        public static bool IsProduction()
        {
            return IsEnvironment(Production);
        }

        /// <summary>
        /// Compares the current hosting environment name against the specified value.
        /// </summary>
        /// <param name="environmentName">Environment name to validate against.</param>
        /// <returns>True if the specified name is the same as the current environment, otherwise false.</returns>
        public static bool IsEnvironment(string environmentName)
        {
            var name = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

            return string.Equals(name, environmentName, StringComparison.OrdinalIgnoreCase);
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="Database"/> class with a connection string and a <see cref="DbProviderFactory"/>.
        /// </summary>
        /// <param name="connectionString">The connection string for the database.</param>
        /// <param name="dbProviderFactory">A <see cref="DbProviderFactory"/> object.</param>
        /// <param name="sqlCache">Sql File Cache Handler</param>
        /// <param name="logger">Applikcation Logger</param>
        protected Database(string connectionString, DbProviderFactory dbProviderFactory, ISqlCache sqlCache, ILogger logger)
        {
            if (string.IsNullOrEmpty(connectionString)) throw new ArgumentException(Resources.ExceptionNullOrEmptyString, "connectionString");
            if (dbProviderFactory == null) throw new ArgumentNullException("dbProviderFactory");

            this.connectionString = new ConnectionString(connectionString, VALID_USER_ID_TOKENS, VALID_PASSWORD_TOKENS);
            this.dbProviderFactory = dbProviderFactory;

            _sqlCache = sqlCache;
            _logger = logger;
        }

        protected Database(ConnectionString connectionString, DbProviderFactory dbProviderFactory)
        {
            this.connectionString = connectionString;
            this.dbProviderFactory = dbProviderFactory;
        }

        /// <summary>
        /// <para>Gets the string used to open a database.</para>
        /// </summary>
        /// <value>
        /// <para>The string used to open a database.</para>
        /// </value>
        /// <seealso cref="DbConnection.ConnectionString"/>
        public string ConnectionString
        {
            get { return connectionString.ToString(); }
        }

        /// <summary>
        /// <para>Gets the connection string without the username and password.</para>
        /// </summary>
        /// <value>
        /// <para>The connection string without the username and password.</para>
        /// </value>
        /// <seealso cref="ConnectionString"/>
        protected string ConnectionStringNoCredentials
        {
            get { return connectionString.ToStringNoCredentials(); }
        }

        /// <summary>
        /// Gets the connection string without credentials.
        /// </summary>
        /// <value>
        /// The connection string without credentials.
        /// </value>
        public string ConnectionStringWithoutCredentials
        {
            get { return ConnectionStringNoCredentials; }
        }

        /// <summary>
        /// <para>Gets the DbProviderFactory used by the database instance.</para>
        /// </summary>
        /// <seealso cref="DbProviderFactory"/>
        public DbProviderFactory DbProviderFactory
        {
            get { return dbProviderFactory; }
        }

        /// <summary>
        /// Adds a new In <see cref="DbParameter"/> object to the given <paramref name="command"/>.
        /// </summary>
        /// <param name="command">The command to add the in parameter.</param>
        /// <param name="name"><para>The name of the parameter.</para></param>
        /// <param name="dbType"><para>One of the <see cref="DbType"/> values.</para></param>                
        /// <remarks>
        /// <para>This version of the method is used when you can have the same parameter object multiple times with different values.</para>
        /// </remarks>        
        public void AddInParameter(DbCommand command,
                                   string name,
                                   DbType dbType)
        {
            AddParameter(command, name, dbType, ParameterDirection.Input, String.Empty, DataRowVersion.Default, null);
        }

        /// <summary>
        /// Adds a new In <see cref="DbParameter"/> object to the given <paramref name="command"/>.
        /// </summary>
        /// <param name="command">The command to add the parameter.</param>
        /// <param name="name"><para>The name of the parameter.</para></param>
        /// <param name="dbType"><para>One of the <see cref="DbType"/> values.</para></param>                
        /// <param name="value"><para>The value of the parameter.</para></param>      
        public void AddInParameter(DbCommand command,
                                   string name,
                                   DbType dbType,
                                   object value)
        {
            AddParameter(command, name, dbType, ParameterDirection.Input, String.Empty, DataRowVersion.Default, value);
        }

        /// <summary>
        /// Adds a new In <see cref="DbParameter"/> object to the given <paramref name="command"/>.
        /// </summary>
        /// <param name="command">The command to add the parameter.</param>
        /// <param name="name"><para>The name of the parameter.</para></param>
        /// <param name="dbType"><para>One of the <see cref="DbType"/> values.</para></param>                
        /// <param name="sourceColumn"><para>The name of the source column mapped to the DataSet and used for loading or returning the value.</para></param>
        /// <param name="sourceVersion"><para>One of the <see cref="DataRowVersion"/> values.</para></param>
        public void AddInParameter(DbCommand command,
                                   string name,
                                   DbType dbType,
                                   string sourceColumn,
                                   DataRowVersion sourceVersion)
        {
            AddParameter(command, name, dbType, 0, ParameterDirection.Input, true, 0, 0, sourceColumn, sourceVersion, null);
        }

        /// <summary>
        /// Adds a new Out <see cref="DbParameter"/> object to the given <paramref name="command"/>.
        /// </summary>
        /// <param name="command">The command to add the out parameter.</param>
        /// <param name="name"><para>The name of the parameter.</para></param>
        /// <param name="dbType"><para>One of the <see cref="DbType"/> values.</para></param>        
        /// <param name="size"><para>The maximum size of the data within the column.</para></param>        
        public void AddOutParameter(DbCommand command,
                                    string name,
                                    DbType dbType,
                                    int size)
        {
            AddParameter(command, name, dbType, size, ParameterDirection.Output, true, 0, 0, String.Empty, DataRowVersion.Default, DBNull.Value);
        }

        /// <summary>
        /// Adds a new In <see cref="DbParameter"/> object to the given <paramref name="command"/>.
        /// </summary>
        /// <param name="command">The command to add the parameter.</param>
        /// <param name="name"><para>The name of the parameter.</para></param>
        /// <param name="dbType"><para>One of the <see cref="DbType"/> values.</para></param>
        /// <param name="size"><para>The maximum size of the data within the column.</para></param>
        /// <param name="direction"><para>One of the <see cref="ParameterDirection"/> values.</para></param>
        /// <param name="nullable"><para>A value indicating whether the parameter accepts <see langword="null"/> (<b>Nothing</b> in Visual Basic) values.</para></param>
        /// <param name="precision"><para>The maximum number of digits used to represent the <paramref name="value"/>.</para></param>
        /// <param name="scale"><para>The number of decimal places to which <paramref name="value"/> is resolved.</para></param>
        /// <param name="sourceColumn"><para>The name of the source column mapped to the DataSet and used for loading or returning the <paramref name="value"/>.</para></param>
        /// <param name="sourceVersion"><para>One of the <see cref="DataRowVersion"/> values.</para></param>
        /// <param name="value"><para>The value of the parameter.</para></param>       
        public virtual void AddParameter(DbCommand command,
                                         string name,
                                         DbType dbType,
                                         int size,
                                         ParameterDirection direction,
                                         bool nullable,
                                         byte precision,
                                         byte scale,
                                         string sourceColumn,
                                         DataRowVersion sourceVersion,
                                         object value)
        {
            if (command == null) throw new ArgumentNullException("command");

            DbParameter parameter = CreateParameter(name, dbType, size, direction, nullable, precision, scale, sourceColumn, sourceVersion, value);
            command.Parameters.Add(parameter);
        }

        /// <summary>
        /// <para>Adds a new instance of a <see cref="DbParameter"/> object to the command.</para>
        /// </summary>
        /// <param name="command">The command to add the parameter.</param>
        /// <param name="name"><para>The name of the parameter.</para></param>
        /// <param name="dbType"><para>One of the <see cref="DbType"/> values.</para></param>        
        /// <param name="direction"><para>One of the <see cref="ParameterDirection"/> values.</para></param>                
        /// <param name="sourceColumn"><para>The name of the source column mapped to the DataSet and used for loading or returning the <paramref name="value"/>.</para></param>
        /// <param name="sourceVersion"><para>One of the <see cref="DataRowVersion"/> values.</para></param>
        /// <param name="value"><para>The value of the parameter.</para></param>    
        public void AddParameter(DbCommand command,
                                 string name,
                                 DbType dbType,
                                 ParameterDirection direction,
                                 string sourceColumn,
                                 DataRowVersion sourceVersion,
                                 object value)
        {
            AddParameter(command, name, dbType, 0, direction, false, 0, 0, sourceColumn, sourceVersion, value);
        }

        void AssignParameterValues(DbCommand command,
                                   object[] values)
        {
            int parameterIndexShift = UserParametersStartIndex(command); // DONE magic number, depends on the database
            for (int i = 0; i < values.Length; i++)
            {
                IDataParameter parameter = command.Parameters[i + parameterIndexShift];

                // There used to be code here that checked to see if the parameter was input or input/output
                // before assigning the value to it. We took it out because of an operational bug with
                // deriving parameters for a stored procedure. It turns out that output parameters are set
                // to input/output after discovery, so any direction checking was unneeded. Should it ever
                // be needed, it should go here, and check that a parameter is input or input/output before
                // assigning a value to it.
                SetParameterValue(command, parameter.ParameterName, values[i]);
            }
        }

        static DbTransaction BeginTransaction(DbConnection connection)
        {
            DbTransaction tran = connection.BeginTransaction();
            return tran;
        }

        /// <summary>
        /// Builds a value parameter name for the current database.
        /// </summary>
        /// <param name="name">The name of the parameter.</param>
        /// <returns>A correctly formated parameter name.</returns>
        public virtual string BuildParameterName(string name)
        {
            return name;
        }

        /// <summary>
        /// Clears the parameter cache. Since there is only one parameter cache that is shared by all instances
        /// of this class, this clears all parameters cached for all databases.
        /// </summary>
        public static void ClearParameterCache()
        {
            parameterCache.Clear();
        }

        static void CommitTransaction(IDbTransaction tran)
        {
            tran.Commit();
        }

        /// <summary>
        /// Configures a given <see cref="DbParameter"/>.
        /// </summary>
        /// <param name="param">The <see cref="DbParameter"/> to configure.</param>
        /// <param name="name"><para>The name of the parameter.</para></param>
        /// <param name="dbType"><para>One of the <see cref="DbType"/> values.</para></param>
        /// <param name="size"><para>The maximum size of the data within the column.</para></param>
        /// <param name="direction"><para>One of the <see cref="ParameterDirection"/> values.</para></param>
        /// <param name="nullable"><para>A value indicating whether the parameter accepts <see langword="null"/> (<b>Nothing</b> in Visual Basic) values.</para></param>
        /// <param name="precision"><para>The maximum number of digits used to represent the <paramref name="value"/>.</para></param>
        /// <param name="scale"><para>The number of decimal places to which <paramref name="value"/> is resolved.</para></param>
        /// <param name="sourceColumn"><para>The name of the source column mapped to the DataSet and used for loading or returning the <paramref name="value"/>.</para></param>
        /// <param name="sourceVersion"><para>One of the <see cref="DataRowVersion"/> values.</para></param>
        /// <param name="value"><para>The value of the parameter.</para></param>  
        protected virtual void ConfigureParameter(DbParameter param,
                                                  string name,
                                                  DbType dbType,
                                                  int size,
                                                  ParameterDirection direction,
                                                  bool nullable,
                                                  byte precision,
                                                  byte scale,
                                                  string sourceColumn,
                                                  DataRowVersion sourceVersion,
                                                  object value)
        {
            param.DbType = dbType;
            param.Size = size;
            param.Value = value ?? DBNull.Value;
            param.Direction = direction;
            param.IsNullable = nullable;
            param.SourceColumn = sourceColumn;
            param.SourceVersion = sourceVersion;
        }

        /// <summary>
        /// <para>Creates a connection for this database.</para>
        /// </summary>
        /// <returns>
        /// <para>The <see cref="DbConnection"/> for this database.</para>
        /// </returns>
        /// <seealso cref="DbConnection"/>        
        public virtual DbConnection CreateConnection()
        {
            DbConnection newConnection = dbProviderFactory.CreateConnection();
            newConnection.ConnectionString = ConnectionString;

            return newConnection;
        }

        /// <summary>
        /// <para>Adds a new instance of a <see cref="DbParameter"/> object.</para>
        /// </summary>
        /// <param name="name"><para>The name of the parameter.</para></param>
        /// <param name="dbType"><para>One of the <see cref="DbType"/> values.</para></param>
        /// <param name="size"><para>The maximum size of the data within the column.</para></param>
        /// <param name="direction"><para>One of the <see cref="ParameterDirection"/> values.</para></param>
        /// <param name="nullable"><para>A value indicating whether the parameter accepts <see langword="null"/> (<b>Nothing</b> in Visual Basic) values.</para></param>
        /// <param name="precision"><para>The maximum number of digits used to represent the <paramref name="value"/>.</para></param>
        /// <param name="scale"><para>The number of decimal places to which <paramref name="value"/> is resolved.</para></param>
        /// <param name="sourceColumn"><para>The name of the source column mapped to the DataSet and used for loading or returning the <paramref name="value"/>.</para></param>
        /// <param name="sourceVersion"><para>One of the <see cref="DataRowVersion"/> values.</para></param>
        /// <param name="value"><para>The value of the parameter.</para></param>  
        /// <returns>A newly created <see cref="DbParameter"/> fully initialized with given parameters.</returns>
        protected DbParameter CreateParameter(string name,
                                              DbType dbType,
                                              int size,
                                              ParameterDirection direction,
                                              bool nullable,
                                              byte precision,
                                              byte scale,
                                              string sourceColumn,
                                              DataRowVersion sourceVersion,
                                              object value)
        {
            DbParameter param = CreateParameter(name);
            ConfigureParameter(param, name, dbType, size, direction, nullable, precision, scale, sourceColumn, sourceVersion, value);
            return param;
        }

        /// <summary>
        /// <para>Adds a new instance of a <see cref="DbParameter"/> object.</para>
        /// </summary>
        /// <param name="name"><para>The name of the parameter.</para></param>
        /// <returns><para>An unconfigured parameter.</para></returns>
        protected DbParameter CreateParameter(string name)
        {
            DbParameter param = dbProviderFactory.CreateParameter();
            param.ParameterName = BuildParameterName(name);

            return param;
        }



        /// <summary>
        /// Does this <see cref='Database'/> object support parameter discovery?
        /// </summary>
        /// <value>Base class always returns false.</value>
        public virtual bool SupportsParemeterDiscovery
        {
            get { return false; }
        }

        /// <summary>
        /// Retrieves parameter information from the stored procedure specified in the <see cref="DbCommand"/> and populates the Parameters collection of the specified <see cref="DbCommand"/> object. 
        /// </summary>
        /// <param name="discoveryCommand">The <see cref="DbCommand"/> to do the discovery.</param>
        protected abstract void DeriveParameters(DbCommand discoveryCommand);

        /// <summary>
        /// Discovers the parameters for a <see cref="DbCommand"/>.
        /// </summary>
        /// <param name="command">The <see cref="DbCommand"/> to discover the parameters.</param>
        public void DiscoverParameters(DbCommand command)
        {
            if (command == null) throw new ArgumentNullException("command");

            using (var wrapper = GetOpenConnection())
            {
                using (DbCommand discoveryCommand = CreateCommandByCommandType(command.CommandType, command.CommandText))
                {
                    discoveryCommand.Connection = wrapper.Connection;
                    DeriveParameters(discoveryCommand);

                    foreach (IDataParameter parameter in discoveryCommand.Parameters)
                    {
                        IDataParameter cloneParameter = (IDataParameter)((ICloneable)parameter).Clone();
                        command.Parameters.Add(cloneParameter);
                    }
                }
            }
        }

        /// <summary>
        /// Executes the query for <paramref name="command"/>.
        /// </summary>
        /// <param name="command">The <see cref="DbCommand"/> representing the query to execute.</param>
        /// <returns>The quantity of rows affected.</returns>
        protected int DoExecuteNonQuery(DbCommand command)
        {
            if (command == null) throw new ArgumentNullException("command");

            var watch = Stopwatch.StartNew();

            int rowsAffected = command.ExecuteNonQuery();

            watch.Stop();
            ConsoleStopwatch(watch);

            return rowsAffected;
        }

        IDataReader DoExecuteReader(DbCommand command,
                                    CommandBehavior cmdBehavior)
        {
            var watch = Stopwatch.StartNew();

            IDataReader reader = command.ExecuteReader(cmdBehavior);

            watch.Stop();
            ConsoleStopwatch(watch);            

            return reader;
        }

        object DoExecuteScalar(IDbCommand command)
        {
            var watch = Stopwatch.StartNew();

            object returnValue = command.ExecuteScalar();

            watch.Stop();
            ConsoleStopwatch(watch);
            
            return returnValue;
        }

        void DoLoadDataSet(IDbCommand command,
                           DataSet dataSet,
                           string[] tableNames)
        {
            if (tableNames == null) throw new ArgumentNullException("tableNames");
            if (tableNames.Length == 0)
            {
                throw new ArgumentException(Resources.ExceptionTableNameArrayEmpty, "tableNames");
            }
            for (int i = 0; i < tableNames.Length; i++)
            {
                if (string.IsNullOrEmpty(tableNames[i])) throw new ArgumentException(Resources.ExceptionNullOrEmptyString, string.Concat("tableNames[", i, "]"));
            }

            var watch = Stopwatch.StartNew();

            using (DbDataAdapter adapter = GetDataAdapter(UpdateBehavior.Standard))
            {
                ((IDbDataAdapter)adapter).SelectCommand = command;

                string systemCreatedTableNameRoot = "Table";
                for (int i = 0; i < tableNames.Length; i++)
                {
                    string systemCreatedTableName = (i == 0)
                                                        ? systemCreatedTableNameRoot
                                                        : systemCreatedTableNameRoot + i;

                    adapter.TableMappings.Add(systemCreatedTableName, tableNames[i]);
                }

                adapter.Fill(dataSet);
            }

            watch.Stop();
            ConsoleStopwatch(watch);
        }

        int DoUpdateDataSet(UpdateBehavior behavior,
                            DataSet dataSet,
                            string tableName,
                            IDbCommand insertCommand,
                            IDbCommand updateCommand,
                            IDbCommand deleteCommand,
                            int? updateBatchSize)
        {
            if (string.IsNullOrEmpty(tableName)) throw new ArgumentException(Resources.ExceptionNullOrEmptyString, "tableName");
            if (dataSet == null) throw new ArgumentNullException("dataSet");

            if (insertCommand == null && updateCommand == null && deleteCommand == null)
            {
                throw new ArgumentException(Resources.ExceptionMessageUpdateDataSetArgumentFailure);
            }

            using (DbDataAdapter adapter = GetDataAdapter(behavior))
            {
                IDbDataAdapter explicitAdapter = adapter;
                if (insertCommand != null)
                {
                    explicitAdapter.InsertCommand = insertCommand;
                }
                if (updateCommand != null)
                {
                    explicitAdapter.UpdateCommand = updateCommand;
                }
                if (deleteCommand != null)
                {
                    explicitAdapter.DeleteCommand = deleteCommand;
                }

                if (updateBatchSize != null)
                {
                    adapter.UpdateBatchSize = (int)updateBatchSize;
                    if (insertCommand != null)
                        adapter.InsertCommand.UpdatedRowSource = UpdateRowSource.None;
                    if (updateCommand != null)
                        adapter.UpdateCommand.UpdatedRowSource = UpdateRowSource.None;
                    if (deleteCommand != null)
                        adapter.DeleteCommand.UpdatedRowSource = UpdateRowSource.None;
                }

                int rows = adapter.Update(dataSet.Tables[tableName]);
                return rows;
            }
        }

        /// <summary>
        /// <para>Executes the <paramref name="command"/> and returns the results in a new <see cref="DataSet"/>.</para>
        /// </summary>
        /// <param name="command"><para>The <see cref="DbCommand"/> to execute.</para></param>
        /// <returns>A <see cref="DataSet"/> with the results of the <paramref name="command"/>.</returns>        
        public virtual DataSet ExecuteDataSet(DbCommand command)
        {
            DataSet dataSet = new DataSet();
            dataSet.Locale = CultureInfo.InvariantCulture;
            LoadDataSet(command, dataSet, "Table");
            return dataSet;
        }

        /// <summary>
        /// <para>Executes the <paramref name="command"/> as part of the <paramref name="transaction" /> and returns the results in a new <see cref="DataSet"/>.</para>
        /// </summary>
        /// <param name="command"><para>The <see cref="DbCommand"/> to execute.</para></param>
        /// <param name="transaction">
        /// <para>The <see cref="IDbTransaction"/> to execute the command within.</para>
        /// </param>
        /// <returns>A <see cref="DataSet"/> with the results of the <paramref name="command"/>.</returns>        
        public virtual DataSet ExecuteDataSet(DbCommand command,
                                              DbTransaction transaction)
        {
            var dataSet = new DataSet();
            dataSet.Locale = CultureInfo.InvariantCulture;
            LoadDataSet(command, dataSet, "Table", transaction);
            return dataSet;
        }

        /// <summary>
        /// <para>Executes the <paramref name="storedProcedureName"/> with <paramref name="parameterValues" /> and returns the results in a new <see cref="DataSet"/>.</para>
        /// </summary>
        /// <param name="storedProcedureName">
        /// <para>The stored procedure to execute.</para>
        /// </param>
        /// <param name="parameterValues">
        /// <para>An array of parameters to pass to the stored procedure. The parameter values must be in call order as they appear in the stored procedure.</para>
        /// </param>
        /// <returns>
        /// <para>A <see cref="DataSet"/> with the results of the <paramref name="storedProcedureName"/>.</para>
        /// </returns>
        public virtual DataSet ExecuteDataSet(string storedProcedureName,
                                              params object[] parameterValues)
        {
            using (DbCommand command = GetStoredProcCommand(storedProcedureName, parameterValues))
            {
                return ExecuteDataSet(command);
            }
        }

        /// <summary>
        /// <para>Executes the <paramref name="storedProcedureName"/> with <paramref name="parameterValues" /> as part of the <paramref name="transaction" /> and returns the results in a new <see cref="DataSet"/> within a transaction.</para>
        /// </summary>
        /// <param name="transaction">
        /// <para>The <see cref="IDbTransaction"/> to execute the command within.</para>
        /// </param>
        /// <param name="storedProcedureName">
        /// <para>The stored procedure to execute.</para>
        /// </param>
        /// <param name="parameterValues">
        /// <para>An array of parameters to pass to the stored procedure. The parameter values must be in call order as they appear in the stored procedure.</para>
        /// </param>
        /// <returns>
        /// <para>A <see cref="DataSet"/> with the results of the <paramref name="storedProcedureName"/>.</para>
        /// </returns>
        public virtual DataSet ExecuteDataSet(DbTransaction transaction,
                                              string storedProcedureName,
                                              params object[] parameterValues)
        {
            using (DbCommand command = GetStoredProcCommand(storedProcedureName, parameterValues))
            {
                return ExecuteDataSet(command, transaction);
            }
        }

        /// <summary>
        /// <para>Executes the <paramref name="commandText"/> interpreted as specified by the <paramref name="commandType" /> and returns the results in a new <see cref="DataSet"/>.</para>
        /// </summary>
        /// <param name="commandType">
        /// <para>One of the <see cref="CommandType"/> values.</para>
        /// </param>
        /// <param name="commandText">
        /// <para>The command text to execute.</para>
        /// </param>
        /// <returns>
        /// <para>A <see cref="DataSet"/> with the results of the <paramref name="commandText"/>.</para>
        /// </returns>
        public virtual DataSet ExecuteDataSet(CommandType commandType,
                                              string commandText)
        {
            using (DbCommand command = CreateCommandByCommandType(commandType, commandText))
            {
                return ExecuteDataSet(command);
            }
        }

        /// <summary>
        /// <para>Executes the <paramref name="commandText"/> as part of the given <paramref name="transaction" /> and returns the results in a new <see cref="DataSet"/>.</para>
        /// </summary>
        /// <param name="transaction">
        /// <para>The <see cref="IDbTransaction"/> to execute the command within.</para>
        /// </param>
        /// <param name="commandType">
        /// <para>One of the <see cref="CommandType"/> values.</para>
        /// </param>
        /// <param name="commandText">
        /// <para>The command text to execute.</para>
        /// </param>
        /// <returns>
        /// <para>A <see cref="DataSet"/> with the results of the <paramref name="commandText"/>.</para>
        /// </returns>
        public virtual DataSet ExecuteDataSet(DbTransaction transaction,
                                              CommandType commandType,
                                              string commandText)
        {
            using (DbCommand command = CreateCommandByCommandType(commandType, commandText))
            {
                return ExecuteDataSet(command, transaction);
            }
        }

        /// <summary>
        /// <para>Executes the <paramref name="command"/> and returns the number of rows affected.</para>
        /// </summary>
        /// <param name="command">
        /// <para>The command that contains the query to execute.</para>
        /// </param>       
        /// <seealso cref="IDbCommand.ExecuteScalar"/>
        public virtual int ExecuteNonQuery(DbCommand command)
        {
            using (var wrapper = GetOpenConnection())
            {
                PrepareCommand(command, wrapper.Connection);
                return DoExecuteNonQuery(command);
            }
        }

        /// <summary>
        /// <para>Executes the <paramref name="command"/> within the given <paramref name="transaction" />, and returns the number of rows affected.</para>
        /// </summary>
        /// <param name="command">
        /// <para>The command that contains the query to execute.</para>
        /// </param>
        /// <param name="transaction">
        /// <para>The <see cref="IDbTransaction"/> to execute the command within.</para>
        /// </param>
        /// <seealso cref="IDbCommand.ExecuteScalar"/>
        public virtual int ExecuteNonQuery(DbCommand command,
                                           DbTransaction transaction)
        {
            PrepareCommand(command, transaction);
            return DoExecuteNonQuery(command);
        }

        /// <summary>
        /// <para>Executes the <paramref name="storedProcedureName"/> using the given <paramref name="parameterValues" /> and returns the number of rows affected.</para>
        /// </summary>
        /// <param name="storedProcedureName">
        /// <para>The name of the stored procedure to execute.</para>
        /// </param>
        /// <param name="parameterValues">
        /// <para>An array of parameters to pass to the stored procedure. The parameter values must be in call order as they appear in the stored procedure.</para>
        /// </param>
        /// <returns>
        /// <para>The number of rows affected</para>
        /// </returns>
        /// <seealso cref="IDbCommand.ExecuteScalar"/>
        public virtual int ExecuteNonQuery(string storedProcedureName,
                                           params object[] parameterValues)
        {
            using (DbCommand command = GetStoredProcCommand(storedProcedureName, parameterValues))
            {
                return ExecuteNonQuery(command);
            }
        }

        /// <summary>
        /// <para>Executes the <paramref name="storedProcedureName"/> using the given <paramref name="parameterValues" /> within a transaction and returns the number of rows affected.</para>
        /// </summary>
        /// <param name="transaction">
        /// <para>The <see cref="IDbTransaction"/> to execute the command within.</para>
        /// </param>
        /// <param name="storedProcedureName">
        /// <para>The name of the stored procedure to execute.</para>
        /// </param>
        /// <param name="parameterValues">
        /// <para>An array of parameters to pass to the stored procedure. The parameter values must be in call order as they appear in the stored procedure.</para>
        /// </param>
        /// <returns>
        /// <para>The number of rows affected.</para>
        /// </returns>
        /// <seealso cref="IDbCommand.ExecuteScalar"/>
        public virtual int ExecuteNonQuery(DbTransaction transaction,
                                           string storedProcedureName,
                                           params object[] parameterValues)
        {
            using (DbCommand command = GetStoredProcCommand(storedProcedureName, parameterValues))
            {
                return ExecuteNonQuery(command, transaction);
            }
        }

        /// <summary>
        /// <para>Executes the <paramref name="commandText"/> interpreted as specified by the <paramref name="commandType" /> and returns the number of rows affected.</para>
        /// </summary>
        /// <param name="commandType">
        /// <para>One of the <see cref="CommandType"/> values.</para>
        /// </param>
        /// <param name="commandText">
        /// <para>The command text to execute.</para>
        /// </param>
        /// <returns>
        /// <para>The number of rows affected.</para>
        /// </returns>
        /// <seealso cref="IDbCommand.ExecuteScalar"/>
        public virtual int ExecuteNonQuery(CommandType commandType,
                                           string commandText)
        {
            using (DbCommand command = CreateCommandByCommandType(commandType, commandText))
            {
                return ExecuteNonQuery(command);
            }
        }

        /// <summary>
        /// <para>Executes the <paramref name="commandText"/> interpreted as specified by the <paramref name="commandType" /> as part of the given <paramref name="transaction" /> and returns the number of rows affected.</para>
        /// </summary>
        /// <param name="transaction">
        /// <para>The <see cref="IDbTransaction"/> to execute the command within.</para>
        /// </param>
        /// <param name="commandType">
        /// <para>One of the <see cref="CommandType"/> values.</para>
        /// </param>
        /// <param name="commandText">
        /// <para>The command text to execute.</para>
        /// </param>
        /// <returns>
        /// <para>The number of rows affected</para>
        /// </returns>
        /// <seealso cref="IDbCommand.ExecuteScalar"/>
        public virtual int ExecuteNonQuery(DbTransaction transaction,
                                           CommandType commandType,
                                           string commandText)
        {
            using (DbCommand command = CreateCommandByCommandType(commandType, commandText))
            {
                return ExecuteNonQuery(command, transaction);
            }
        }

        /// <summary>
        /// <para>Executes the <paramref name="command"/> and returns an <see cref="IDataReader"></see> through which the result can be read.
        /// It is the responsibility of the caller to close the reader when finished.</para>
        /// </summary>
        /// <param name="command">
        /// <para>The command that contains the query to execute.</para>
        /// </param>
        /// <returns>
        /// <para>An <see cref="IDataReader"/> object.</para>
        /// </returns>        
        public virtual IDataReader ExecuteReader(DbCommand command)
        {
            using (DatabaseConnectionWrapper wrapper = GetOpenConnection())
            {
                PrepareCommand(command, wrapper.Connection);
                IDataReader realReader = DoExecuteReader(command, CommandBehavior.Default);
                return CreateWrappedReader(wrapper, realReader);
            }
        }

        /// <summary>
        /// All data readers get wrapped in objects so that they properly manage connections.
        /// Some derived Database classes will need to create a different wrapper, so this
        /// method is provided so that they can do this.
        /// </summary>
        /// <param name="connection">Connection + refcount.</param>
        /// <param name="innerReader">The reader to wrap.</param>
        /// <returns>The new reader.</returns>
        protected virtual IDataReader CreateWrappedReader(DatabaseConnectionWrapper connection, IDataReader innerReader)
        {
            return new RefCountingDataReader(connection, innerReader);
        }

        /// <summary>
        /// <para>Executes the <paramref name="command"/> within a transaction and returns an <see cref="IDataReader"></see> through which the result can be read.
        /// It is the responsibility of the caller to close the connection and reader when finished.</para>
        /// </summary>
        /// <param name="command">
        /// <para>The command that contains the query to execute.</para>
        /// </param>
        /// <param name="transaction">
        /// <para>The <see cref="IDbTransaction"/> to execute the command within.</para>
        /// </param>
        /// <returns>
        /// <para>An <see cref="IDataReader"/> object.</para>
        /// </returns>        
        public virtual IDataReader ExecuteReader(DbCommand command,
                                                 DbTransaction transaction)
        {
            PrepareCommand(command, transaction);
            return DoExecuteReader(command, CommandBehavior.Default);
        }

        /// <summary>
        /// <para>Executes the <paramref name="storedProcedureName"/> with the given <paramref name="parameterValues" /> and returns an <see cref="IDataReader"></see> through which the result can be read.
        /// It is the responsibility of the caller to close the connection and reader when finished.</para>
        /// </summary>        
        /// <param name="storedProcedureName">
        /// <para>The command that contains the query to execute.</para>
        /// </param>
        /// <param name="parameterValues">
        /// <para>An array of parameters to pass to the stored procedure. The parameter values must be in call order as they appear in the stored procedure.</para>
        /// </param>
        /// <returns>
        /// <para>An <see cref="IDataReader"/> object.</para>
        /// </returns>        
        public IDataReader ExecuteReader(string storedProcedureName,
                                         params object[] parameterValues)
        {
            using (DbCommand command = GetStoredProcCommand(storedProcedureName, parameterValues))
            {
                return ExecuteReader(command);
            }
        }

        /// <summary>
        /// <para>Executes the <paramref name="storedProcedureName"/> with the given <paramref name="parameterValues" /> within the given <paramref name="transaction" /> and returns an <see cref="IDataReader"></see> through which the result can be read.
        /// It is the responsibility of the caller to close the connection and reader when finished.</para>
        /// </summary>
        /// <param name="transaction">
        /// <para>The <see cref="IDbTransaction"/> to execute the command within.</para>
        /// </param>
        /// <param name="storedProcedureName">
        /// <para>The command that contains the query to execute.</para>
        /// </param>
        /// <param name="parameterValues">
        /// <para>An array of parameters to pass to the stored procedure. The parameter values must be in call order as they appear in the stored procedure.</para>
        /// </param>
        /// <returns>
        /// <para>An <see cref="IDataReader"/> object.</para>
        /// </returns>        
        public IDataReader ExecuteReader(DbTransaction transaction,
                                         string storedProcedureName,
                                         params object[] parameterValues)
        {
            using (DbCommand command = GetStoredProcCommand(storedProcedureName, parameterValues))
            {
                return ExecuteReader(command, transaction);
            }
        }

        /// <summary>
        /// <para>Executes the <paramref name="commandText"/> interpreted as specified by the <paramref name="commandType" /> and returns an <see cref="IDataReader"></see> through which the result can be read.
        /// It is the responsibility of the caller to close the connection and reader when finished.</para>
        /// </summary>
        /// <param name="commandType">
        /// <para>One of the <see cref="CommandType"/> values.</para>
        /// </param>
        /// <param name="commandText">
        /// <para>The command text to execute.</para>
        /// </param>
        /// <returns>
        /// <para>An <see cref="IDataReader"/> object.</para>
        /// </returns>        
        public IDataReader ExecuteReader(CommandType commandType,
                                         string commandText)
        {
            using (DbCommand command = CreateCommandByCommandType(commandType, commandText))
            {
                return ExecuteReader(command);
            }
        }

        /// <summary>
        /// <para>Executes the <paramref name="commandText"/> interpreted as specified by the <paramref name="commandType" /> within the given 
        /// <paramref name="transaction" /> and returns an <see cref="IDataReader"></see> through which the result can be read.
        /// It is the responsibility of the caller to close the connection and reader when finished.</para>
        /// </summary>
        /// <param name="transaction">
        /// <para>The <see cref="IDbTransaction"/> to execute the command within.</para>
        /// </param>
        /// <param name="commandType">
        /// <para>One of the <see cref="CommandType"/> values.</para>
        /// </param>
        /// <param name="commandText">
        /// <para>The command text to execute.</para>
        /// </param>
        /// <returns>
        /// <para>An <see cref="IDataReader"/> object.</para>
        /// </returns>        
        public IDataReader ExecuteReader(DbTransaction transaction,
                                         CommandType commandType,
                                         string commandText)
        {
            using (DbCommand command = CreateCommandByCommandType(commandType, commandText))
            {
                return ExecuteReader(command, transaction);
            }
        }

        /// <summary>
        /// <para>Executes the <paramref name="command"/> and returns the first column of the first row in the result set returned by the query. Extra columns or rows are ignored.</para>
        /// </summary>
        /// <param name="command">
        /// <para>The command that contains the query to execute.</para>
        /// </param>
        /// <returns>
        /// <para>The first column of the first row in the result set.</para>
        /// </returns>
        /// <seealso cref="IDbCommand.ExecuteScalar"/>
        public virtual object ExecuteScalar(DbCommand command)
        {
            if (command == null) throw new ArgumentNullException("command");

            using (var wrapper = GetOpenConnection())
            {
                PrepareCommand(command, wrapper.Connection);
                return DoExecuteScalar(command);
            }
        }

        /// <summary>
        /// <para>Executes the <paramref name="command"/> within a <paramref name="transaction" />, and returns the first column of the first row in the result set returned by the query. Extra columns or rows are ignored.</para>
        /// </summary>
        /// <param name="command">
        /// <para>The command that contains the query to execute.</para>
        /// </param>
        /// <param name="transaction">
        /// <para>The <see cref="IDbTransaction"/> to execute the command within.</para>
        /// </param>
        /// <returns>
        /// <para>The first column of the first row in the result set.</para>
        /// </returns>
        public virtual object ExecuteScalar(DbCommand command,
                                            DbTransaction transaction)
        {
            PrepareCommand(command, transaction);
            return DoExecuteScalar(command);
        }

        /// <summary>
        /// <para>Executes the <paramref name="storedProcedureName"/> with the given <paramref name="parameterValues" /> and returns the first column of the first row in the result set returned by the query. Extra columns or rows are ignored.</para>
        /// </summary>
        /// <param name="storedProcedureName">
        /// <para>The stored procedure to execute.</para>
        /// </param>
        /// <param name="parameterValues">
        /// <para>An array of parameters to pass to the stored procedure. The parameter values must be in call order as they appear in the stored procedure.</para>
        /// </param>
        /// <returns>
        /// <para>The first column of the first row in the result set.</para>
        /// </returns>
        /// <seealso cref="IDbCommand.ExecuteScalar"/>
        public virtual object ExecuteScalar(string storedProcedureName,
                                            params object[] parameterValues)
        {
            using (DbCommand command = GetStoredProcCommand(storedProcedureName, parameterValues))
            {
                return ExecuteScalar(command);
            }
        }

        /// <summary>
        /// <para>Executes the <paramref name="storedProcedureName"/> with the given <paramref name="parameterValues" /> within a 
        /// <paramref name="transaction" /> and returns the first column of the first row in the result set returned by the query. Extra columns or rows are ignored.</para>
        /// </summary>
        /// <param name="transaction">
        /// <para>The <see cref="IDbTransaction"/> to execute the command within.</para>
        /// </param>
        /// <param name="storedProcedureName">
        /// <para>The stored procedure to execute.</para>
        /// </param>
        /// <param name="parameterValues">
        /// <para>An array of parameters to pass to the stored procedure. The parameter values must be in call order as they appear in the stored procedure.</para>
        /// </param>
        /// <returns>
        /// <para>The first column of the first row in the result set.</para>
        /// </returns>
        /// <seealso cref="IDbCommand.ExecuteScalar"/>
        public virtual object ExecuteScalar(DbTransaction transaction,
                                            string storedProcedureName,
                                            params object[] parameterValues)
        {
            using (DbCommand command = GetStoredProcCommand(storedProcedureName, parameterValues))
            {
                return ExecuteScalar(command, transaction);
            }
        }

        /// <summary>
        /// <para>Executes the <paramref name="commandText"/> interpreted as specified by the <paramref name="commandType" />  and returns the first column of the first row in the result set returned by the query. Extra columns or rows are ignored.</para>
        /// </summary>
        /// <param name="commandType">
        /// <para>One of the <see cref="CommandType"/> values.</para>
        /// </param>
        /// <param name="commandText">
        /// <para>The command text to execute.</para>
        /// </param>
        /// <returns>
        /// <para>The first column of the first row in the result set.</para>
        /// </returns>
        /// <seealso cref="IDbCommand.ExecuteScalar"/>
        public virtual object ExecuteScalar(CommandType commandType,
                                            string commandText)
        {
            using (DbCommand command = CreateCommandByCommandType(commandType, commandText))
            {
                return ExecuteScalar(command);
            }
        }

        /// <summary>
        /// <para>Executes the <paramref name="commandText"/> interpreted as specified by the <paramref name="commandType" /> 
        /// within the given <paramref name="transaction" /> and returns the first column of the first row in the result set returned by the query. Extra columns or rows are ignored.</para>
        /// </summary>
        /// <param name="transaction">
        /// <para>The <see cref="IDbTransaction"/> to execute the command within.</para>
        /// </param>
        /// <param name="commandType">
        /// <para>One of the <see cref="CommandType"/> values.</para>
        /// </param>
        /// <param name="commandText">
        /// <para>The command text to execute.</para>
        /// </param>
        /// <returns>
        /// <para>The first column of the first row in the result set.</para>
        /// </returns>
        /// <seealso cref="IDbCommand.ExecuteScalar"/>
        public virtual object ExecuteScalar(DbTransaction transaction,
                                            CommandType commandType,
                                            string commandText)
        {
            using (DbCommand command = CreateCommandByCommandType(commandType, commandText))
            {
                return ExecuteScalar(command, transaction);
            }
        }

        /// <summary>
        /// Gets a DbDataAdapter with Standard update behavior.
        /// </summary>
        /// <returns>A <see cref="DbDataAdapter"/>.</returns>
        /// <seealso cref="DbDataAdapter"/>
        /// <devdoc>
        /// Created this new, public method instead of modifying the protected, abstract one so that there will be no
        /// breaking changes for any currently derived Database class.
        /// </devdoc>
        public DbDataAdapter GetDataAdapter()
        {
            return GetDataAdapter(UpdateBehavior.Standard);
        }

        /// <summary>
        /// Gets the DbDataAdapter with the given update behavior and connection from the proper derived class.
        /// </summary>
        /// <param name="updateBehavior">
        /// <para>One of the <see cref="UpdateBehavior"/> values.</para>
        /// </param>        
        /// <returns>A <see cref="DbDataAdapter"/>.</returns>
        /// <seealso cref="DbDataAdapter"/>
        protected DbDataAdapter GetDataAdapter(UpdateBehavior updateBehavior)
        {
            DbDataAdapter adapter = dbProviderFactory.CreateDataAdapter();

            if (updateBehavior == UpdateBehavior.Continue)
            {
                SetUpRowUpdatedEvent(adapter);
            }
            return adapter;
        }

        internal DbConnection GetNewOpenConnection()
        {
            DbConnection connection = null;
            try
            {
                    connection = CreateConnection();
                    connection.Open();
            }
            catch
            {
                if (connection != null)
                    connection.Close();

                throw;
            }

            return connection;
        }

        /// <summary>
        ///        Gets a "wrapped" connection that will be not be disposed if a transaction is
        ///        active (created by creating a <see cref="TransactionScope"/> instance). The
        ///        connection will be disposed when no transaction is active.
        /// </summary>
        /// <returns></returns>
        protected DatabaseConnectionWrapper GetOpenConnection()
        {
            DatabaseConnectionWrapper connection = TransactionScopeConnections.GetConnection(this);
            return connection ?? GetWrappedConnection();
        }

        /// <summary>
        /// Gets a "wrapped" connection for use outside a transaction.
        /// </summary>
        /// <returns>The wrapped connection.</returns>
        protected virtual DatabaseConnectionWrapper GetWrappedConnection()
        {
            return new DatabaseConnectionWrapper(GetNewOpenConnection());
        }

        /// <summary>
        /// Gets a parameter value.
        /// </summary>
        /// <param name="command">The command that contains the parameter.</param>
        /// <param name="name">The name of the parameter.</param>
        /// <returns>The value of the parameter.</returns>
        public virtual object GetParameterValue(DbCommand command,
                                                string name)
        {
            if (command == null) throw new ArgumentNullException("command");

            return command.Parameters[BuildParameterName(name)].Value;
        }

        /// <summary>
        /// <para>Creates a <see cref="DbCommand"/> for a SQL query.</para>
        /// </summary>
        /// <param name="query"><para>The text of the query.</para></param>        
        /// <returns><para>The <see cref="DbCommand"/> for the SQL query.</para></returns>        
        public DbCommand GetSqlStringCommand(string query)
        {
            if (string.IsNullOrEmpty(query)) throw new ArgumentException(Resources.ExceptionNullOrEmptyString, "query");

            return CreateCommandByCommandType(CommandType.Text, query);
        }

        /// <summary>
        /// <para>Creates a <see cref="DbCommand"/> for a stored procedure.</para>
        /// </summary>
        /// <param name="storedProcedureName"><para>The name of the stored procedure.</para></param>
        /// <returns><para>The <see cref="DbCommand"/> for the stored procedure.</para></returns>       
        public virtual DbCommand GetStoredProcCommand(string storedProcedureName)
        {
            if (string.IsNullOrEmpty(storedProcedureName)) throw new ArgumentException(Resources.ExceptionNullOrEmptyString, "storedProcedureName");

            return CreateCommandByCommandType(CommandType.StoredProcedure, storedProcedureName);
        }

        /// <summary>
        /// <para>Creates a <see cref="DbCommand"/> for a stored procedure.</para>
        /// </summary>
        /// <param name="storedProcedureName"><para>The name of the stored procedure.</para></param>
        /// <param name="parameterValues"><para>The list of parameters for the procedure.</para></param>
        /// <returns><para>The <see cref="DbCommand"/> for the stored procedure.</para></returns>
        /// <remarks>
        /// <para>The parameters for the stored procedure will be discovered and the values are assigned in positional order.</para>
        /// </remarks>        
        public virtual DbCommand GetStoredProcCommand(string storedProcedureName,
                                                      params object[] parameterValues)
        {
            if (string.IsNullOrEmpty(storedProcedureName)) throw new ArgumentException(Resources.ExceptionNullOrEmptyString, "storedProcedureName");

            DbCommand command = CreateCommandByCommandType(CommandType.StoredProcedure, storedProcedureName);

            AssignParameters(command, parameterValues);

            return command;
        }

        /// <summary>
        /// <para>Discovers parameters on the <paramref name="command"/> and assigns the values from <paramref name="parameterValues"/> to the <paramref name="command"/>s Parameters list.</para>
        /// </summary>
        /// <param name="command">The command the parameter values will be assigned to</param>
        /// <param name="parameterValues">The parameter values that will be assigned to the command.</param>
        public virtual void AssignParameters(DbCommand command, object[] parameterValues)
        {
            parameterCache.SetParameters(command, this);

            if (SameNumberOfParametersAndValues(command, parameterValues) == false)
            {
                throw new InvalidOperationException(Resources.ExceptionMessageParameterMatchFailure);
            }

            AssignParameterValues(command, parameterValues);
        }

        /// <summary>
        /// Wraps around a derived class's implementation of the GetStoredProcCommandWrapper method and adds functionality for
        /// using this method with UpdateDataSet.  The GetStoredProcCommandWrapper method (above) that takes a params array 
        /// expects the array to be filled with VALUES for the parameters. This method differs from the GetStoredProcCommandWrapper 
        /// method in that it allows a user to pass in a string array. It will also dynamically discover the parameters for the 
        /// stored procedure and set the parameter's SourceColumns to the strings that are passed in. It does this by mapping 
        /// the parameters to the strings IN ORDER. Thus, order is very important.
        /// </summary>
        /// <param name="storedProcedureName"><para>The name of the stored procedure.</para></param>
        /// <param name="sourceColumns"><para>The list of DataFields for the procedure.</para></param>
        /// <returns><para>The <see cref="DbCommand"/> for the stored procedure.</para></returns>
        public DbCommand GetStoredProcCommandWithSourceColumns(string storedProcedureName,
                                                               params string[] sourceColumns)
        {
            if (string.IsNullOrEmpty(storedProcedureName)) throw new ArgumentException(Resources.ExceptionNullOrEmptyString, "storedProcedureName");
            if (sourceColumns == null) throw new ArgumentNullException("sourceColumns");

            DbCommand dbCommand = GetStoredProcCommand(storedProcedureName);

            //we do not actually set the connection until the Fill or Update, so we need to temporarily do it here so we can set the sourcecolumns
            using (DbConnection connection = CreateConnection())
            {
                dbCommand.Connection = connection;
                DiscoverParameters(dbCommand);
            }

            int iSourceIndex = 0;
            foreach (IDataParameter dbParam in dbCommand.Parameters)
            {
                if ((dbParam.Direction == ParameterDirection.Input) | (dbParam.Direction == ParameterDirection.InputOutput))
                {
                    dbParam.SourceColumn = sourceColumns[iSourceIndex];
                    iSourceIndex++;
                }
            }

            return dbCommand;
        }

        /// <summary>
        /// <para>Executes the <paramref name="command"/> and adds a new <see cref="DataTable"></see> to the existing <see cref="DataSet"></see>.</para>
        /// </summary>
        /// <param name="command">
        /// <para>The <see cref="DbCommand"/> to execute.</para>
        /// </param>
        /// <param name="dataSet">
        /// <para>The <see cref="DataSet"/> to load.</para>
        /// </param>
        /// <param name="tableName">
        /// <para>The name for the new <see cref="DataTable"/> to add to the <see cref="DataSet"/>.</para>
        /// </param>        
        /// <exception cref="System.ArgumentNullException">Any input parameter was <see langword="null"/> (<b>Nothing</b> in Visual Basic)</exception>
        /// <exception cref="System.ArgumentException">tableName was an empty string</exception>
        public virtual void LoadDataSet(DbCommand command,
                                        DataSet dataSet,
                                        string tableName)
        {
            LoadDataSet(command, dataSet, new[] { tableName });
        }

        /// <summary>
        /// <para>Executes the <paramref name="command"/> within the given <paramref name="transaction" /> and adds a new <see cref="DataTable"></see> to the existing <see cref="DataSet"></see>.</para>
        /// </summary>
        /// <param name="command">
        /// <para>The <see cref="DbCommand"/> to execute.</para>
        /// </param>
        /// <param name="dataSet">
        /// <para>The <see cref="DataSet"/> to load.</para>
        /// </param>
        /// <param name="tableName">
        /// <para>The name for the new <see cref="DataTable"/> to add to the <see cref="DataSet"/>.</para>
        /// </param>
        /// <param name="transaction">
        /// <para>The <see cref="IDbTransaction"/> to execute the command within.</para>
        /// </param>        
        /// <exception cref="System.ArgumentNullException">Any input parameter was <see langword="null"/> (<b>Nothing</b> in Visual Basic).</exception>
        /// <exception cref="System.ArgumentException">tableName was an empty string.</exception>
        public virtual void LoadDataSet(DbCommand command,
                                        DataSet dataSet,
                                        string tableName,
                                        DbTransaction transaction)
        {
            LoadDataSet(command, dataSet, new[] { tableName }, transaction);
        }

        /// <summary>
        /// <para>Loads a <see cref="DataSet"/> from a <see cref="DbCommand"/>.</para>
        /// </summary>
        /// <param name="command">
        /// <para>The command to execute to fill the <see cref="DataSet"/>.</para>
        /// </param>
        /// <param name="dataSet">
        /// <para>The <see cref="DataSet"/> to fill.</para>
        /// </param>
        /// <param name="tableNames">
        /// <para>An array of table name mappings for the <see cref="DataSet"/>.</para>
        /// </param>
        public virtual void LoadDataSet(DbCommand command,
                                        DataSet dataSet,
                                        string[] tableNames)
        {
            using (var wrapper = GetOpenConnection())
            {
                PrepareCommand(command, wrapper.Connection);
                DoLoadDataSet(command, dataSet, tableNames);
            }
        }

        /// <summary>
        /// <para>Loads a <see cref="DataSet"/> from a <see cref="DbCommand"/> in  a transaction.</para>
        /// </summary>
        /// <param name="command">
        /// <para>The command to execute to fill the <see cref="DataSet"/>.</para>
        /// </param>
        /// <param name="dataSet">
        /// <para>The <see cref="DataSet"/> to fill.</para>
        /// </param>
        /// <param name="tableNames">
        /// <para>An array of table name mappings for the <see cref="DataSet"/>.</para>
        /// </param>
        /// <param name="transaction">
        /// <para>The <see cref="IDbTransaction"/> to execute the command in.</para>
        /// </param>
        public virtual void LoadDataSet(DbCommand command,
                                        DataSet dataSet,
                                        string[] tableNames,
                                        DbTransaction transaction)
        {
            PrepareCommand(command, transaction);
            DoLoadDataSet(command, dataSet, tableNames);
        }

        /// <summary>
        /// <para>Loads a <see cref="DataSet"/> with the results returned from a stored procedure.</para>
        /// </summary>
        /// <param name="storedProcedureName">
        /// <para>The stored procedure name to execute.</para>
        /// </param>
        /// <param name="dataSet">
        /// <para>The <see cref="DataSet"/> to fill.</para>
        /// </param>
        /// <param name="tableNames">
        /// <para>An array of table name mappings for the <see cref="DataSet"/>.</para>
        /// </param>
        /// <param name="parameterValues">
        /// <para>An array of parameters to pass to the stored procedure. The parameter values must be in call order as they appear in the stored procedure.</para>
        /// </param>
        public virtual void LoadDataSet(string storedProcedureName,
                                        DataSet dataSet,
                                        string[] tableNames,
                                        params object[] parameterValues)
        {
            using (DbCommand command = GetStoredProcCommand(storedProcedureName, parameterValues))
            {
                LoadDataSet(command, dataSet, tableNames);
            }
        }

        /// <summary>
        /// <para>Loads a <see cref="DataSet"/> with the results returned from a stored procedure executed in a transaction.</para>
        /// </summary>
        /// <param name="transaction">
        /// <para>The <see cref="IDbTransaction"/> to execute the stored procedure in.</para>
        /// </param>
        /// <param name="storedProcedureName">
        /// <para>The stored procedure name to execute.</para>
        /// </param>
        /// <param name="dataSet">
        /// <para>The <see cref="DataSet"/> to fill.</para>
        /// </param>
        /// <param name="tableNames">
        /// <para>An array of table name mappings for the <see cref="DataSet"/>.</para>
        /// </param>
        /// <param name="parameterValues">
        /// <para>An array of parameters to pass to the stored procedure. The parameter values must be in call order as they appear in the stored procedure.</para>
        /// </param>
        public virtual void LoadDataSet(DbTransaction transaction,
                                        string storedProcedureName,
                                        DataSet dataSet,
                                        string[] tableNames,
                                        params object[] parameterValues)
        {
            using (DbCommand command = GetStoredProcCommand(storedProcedureName, parameterValues))
            {
                LoadDataSet(command, dataSet, tableNames, transaction);
            }
        }

        /// <summary>
        /// <para>Loads a <see cref="DataSet"/> from command text.</para>
        /// </summary>
        /// <param name="commandType">
        /// <para>One of the <see cref="CommandType"/> values.</para>
        /// </param>
        /// <param name="commandText">
        /// <para>The command text to execute.</para>
        /// </param>
        /// <param name="dataSet">
        /// <para>The <see cref="DataSet"/> to fill.</para>
        /// </param>
        /// <param name="tableNames">
        /// <para>An array of table name mappings for the <see cref="DataSet"/>.</para>
        /// </param>
        public virtual void LoadDataSet(CommandType commandType,
                                        string commandText,
                                        DataSet dataSet,
                                        string[] tableNames)
        {
            using (DbCommand command = CreateCommandByCommandType(commandType, commandText))
            {
                LoadDataSet(command, dataSet, tableNames);
            }
        }

        /// <summary>
        /// <para>Loads a <see cref="DataSet"/> from command text in a transaction.</para>
        /// </summary>
        /// <param name="transaction">
        /// <para>The <see cref="IDbTransaction"/> to execute the command in.</para>
        /// </param>
        /// <param name="commandType">
        /// <para>One of the <see cref="CommandType"/> values.</para>
        /// </param>
        /// <param name="commandText">
        /// <para>The command text to execute.</para>
        /// </param>
        /// <param name="dataSet">
        /// <para>The <see cref="DataSet"/> to fill.</para>
        /// </param>
        /// <param name="tableNames">
        /// <para>An array of table name mappings for the <see cref="DataSet"/>.</para>
        /// </param>
        public void LoadDataSet(DbTransaction transaction,
                                CommandType commandType,
                                string commandText,
                                DataSet dataSet,
                                string[] tableNames)
        {
            using (DbCommand command = CreateCommandByCommandType(commandType, commandText))
            {
                LoadDataSet(command, dataSet, tableNames, transaction);
            }
        }

        /// <summary>
        /// <para>Assigns a <paramref name="connection"/> to the <paramref name="command"/> and discovers parameters if needed.</para>
        /// </summary>
        /// <param name="command"><para>The command that contains the query to prepare.</para></param>
        /// <param name="connection">The connection to assign to the command.</param>
        protected static void PrepareCommand(DbCommand command,
                                             DbConnection connection)
        {
            if (command == null) throw new ArgumentNullException("command");
            if (connection == null) throw new ArgumentNullException("connection");

            command.Connection = connection;
        }

        /// <summary>
        /// <para>Assigns a <paramref name="transaction"/> to the <paramref name="command"/> and discovers parameters if needed.</para>
        /// </summary>
        /// <param name="command"><para>The command that contains the query to prepare.</para></param>
        /// <param name="transaction">The transaction to assign to the command.</param>
        protected static void PrepareCommand(DbCommand command,
                                             DbTransaction transaction)
        {
            if (command == null) throw new ArgumentNullException("command");
            if (transaction == null) throw new ArgumentNullException("transaction");

            PrepareCommand(command, transaction.Connection);
            command.Transaction = transaction;
        }

        static void RollbackTransaction(IDbTransaction tran)
        {
            tran.Rollback();
        }

        /// <summary>
        /// Determines if the number of parameters in the command matches the array of parameter values.
        /// </summary>
        /// <param name="command">The <see cref="DbCommand"/> containing the parameters.</param>
        /// <param name="values">The array of parameter values.</param>
        /// <returns><see langword="true"/> if the number of parameters and values match; otherwise, <see langword="false"/>.</returns>
        protected virtual bool SameNumberOfParametersAndValues(DbCommand command,
                                                               object[] values)
        {
            int numberOfParametersToStoredProcedure = command.Parameters.Count;
            int numberOfValuesProvidedForStoredProcedure = values.Length;
            return numberOfParametersToStoredProcedure == numberOfValuesProvidedForStoredProcedure;
        }

        /// <summary>
        /// Sets a parameter value.
        /// </summary>
        /// <param name="command">The command with the parameter.</param>
        /// <param name="parameterName">The parameter name.</param>
        /// <param name="value">The parameter value.</param>
        public virtual void SetParameterValue(DbCommand command,
                                              string parameterName,
                                              object value)
        {
            if (command == null) throw new ArgumentNullException("command");

            command.Parameters[BuildParameterName(parameterName)].Value = value ?? DBNull.Value;
        }

        /// <summary>
        /// Sets the RowUpdated event for the data adapter.
        /// </summary>
        /// <param name="adapter">The <see cref="DbDataAdapter"/> to set the event.</param>
        protected virtual void SetUpRowUpdatedEvent(DbDataAdapter adapter) { }

        /// <summary>
        /// <para>Calls the respective INSERT, UPDATE, or DELETE statements for each inserted, updated, or deleted row in the <see cref="DataSet"/>.</para>
        /// </summary>        
        /// <param name="dataSet"><para>The <see cref="DataSet"/> used to update the data source.</para></param>
        /// <param name="tableName"><para>The name of the source table to use for table mapping.</para></param>
        /// <param name="insertCommand"><para>The <see cref="DbCommand"/> executed when <see cref="DataRowState"/> is <seealso cref="DataRowState.Added"/></para></param>
        /// <param name="updateCommand"><para>The <see cref="DbCommand"/> executed when <see cref="DataRowState"/> is <seealso cref="DataRowState.Modified"/></para></param>        
        /// <param name="deleteCommand"><para>The <see cref="DbCommand"/> executed when <see cref="DataRowState"/> is <seealso cref="DataRowState.Deleted"/></para></param>        
        /// <param name="updateBehavior"><para>One of the <see cref="UpdateBehavior"/> values.</para></param>
        /// <param name="updateBatchSize">The number of database commands to execute in a batch.</param>
        /// <returns>number of records affected</returns>        
        public int UpdateDataSet(DataSet dataSet,
                                 string tableName,
                                 DbCommand insertCommand,
                                 DbCommand updateCommand,
                                 DbCommand deleteCommand,
                                 UpdateBehavior updateBehavior,
                                 int? updateBatchSize)
        {
            using (var wrapper = GetOpenConnection())
            {
                if (updateBehavior == UpdateBehavior.Transactional && Transaction.Current == null)
                {
                    DbTransaction transaction = BeginTransaction(wrapper.Connection);
                    try
                    {
                        int rowsAffected = UpdateDataSet(dataSet, tableName, insertCommand, updateCommand, deleteCommand, transaction, updateBatchSize);
                        CommitTransaction(transaction);
                        return rowsAffected;
                    }
                    catch
                    {
                        RollbackTransaction(transaction);
                        throw;
                    }
                }

                if (insertCommand != null)
                {
                    PrepareCommand(insertCommand, wrapper.Connection);
                }
                if (updateCommand != null)
                {
                    PrepareCommand(updateCommand, wrapper.Connection);
                }
                if (deleteCommand != null)
                {
                    PrepareCommand(deleteCommand, wrapper.Connection);
                }

                return DoUpdateDataSet(updateBehavior, dataSet, tableName,
                                       insertCommand, updateCommand, deleteCommand, updateBatchSize);
            }
        }

        /// <summary>
        /// <para>Calls the respective INSERT, UPDATE, or DELETE statements for each inserted, updated, or deleted row in the <see cref="DataSet"/>.</para>
        /// </summary>        
        /// <param name="dataSet"><para>The <see cref="DataSet"/> used to update the data source.</para></param>
        /// <param name="tableName"><para>The name of the source table to use for table mapping.</para></param>
        /// <param name="insertCommand"><para>The <see cref="DbCommand"/> executed when <see cref="DataRowState"/> is <seealso cref="DataRowState.Added"/></para></param>
        /// <param name="updateCommand"><para>The <see cref="DbCommand"/> executed when <see cref="DataRowState"/> is <seealso cref="DataRowState.Modified"/></para></param>        
        /// <param name="deleteCommand"><para>The <see cref="DbCommand"/> executed when <see cref="DataRowState"/> is <seealso cref="DataRowState.Deleted"/></para></param>        
        /// <param name="updateBehavior"><para>One of the <see cref="UpdateBehavior"/> values.</para></param>
        /// <returns>number of records affected</returns>        
        public int UpdateDataSet(DataSet dataSet,
                                 string tableName,
                                 DbCommand insertCommand,
                                 DbCommand updateCommand,
                                 DbCommand deleteCommand,
                                 UpdateBehavior updateBehavior)
        {
            return UpdateDataSet(dataSet, tableName, insertCommand, updateCommand, deleteCommand, updateBehavior, null);
        }

        /// <summary>
        /// <para>Calls the respective INSERT, UPDATE, or DELETE statements for each inserted, updated, or deleted row in the <see cref="DataSet"/> within a transaction.</para>
        /// </summary>        
        /// <param name="dataSet"><para>The <see cref="DataSet"/> used to update the data source.</para></param>
        /// <param name="tableName"><para>The name of the source table to use for table mapping.</para></param>
        /// <param name="insertCommand"><para>The <see cref="DbCommand"/> executed when <see cref="DataRowState"/> is <seealso cref="DataRowState.Added"/>.</para></param>
        /// <param name="updateCommand"><para>The <see cref="DbCommand"/> executed when <see cref="DataRowState"/> is <seealso cref="DataRowState.Modified"/>.</para></param>        
        /// <param name="deleteCommand"><para>The <see cref="DbCommand"/> executed when <see cref="DataRowState"/> is <seealso cref="DataRowState.Deleted"/>.</para></param>        
        /// <param name="transaction"><para>The <see cref="IDbTransaction"/> to use.</para></param>
        /// <param name="updateBatchSize">The number of commands that can be executed in a single call to the database. Set to 0 to
        /// use the largest size the server can handle, 1 to disable batch updates, and anything else to set the number of rows.
        /// </param>
        /// <returns>Number of records affected.</returns>        
        public int UpdateDataSet(DataSet dataSet,
                                 string tableName,
                                 DbCommand insertCommand,
                                 DbCommand updateCommand,
                                 DbCommand deleteCommand,
                                 DbTransaction transaction,
                                 int? updateBatchSize)
        {
            if (insertCommand != null)
            {
                PrepareCommand(insertCommand, transaction);
            }
            if (updateCommand != null)
            {
                PrepareCommand(updateCommand, transaction);
            }
            if (deleteCommand != null)
            {
                PrepareCommand(deleteCommand, transaction);
            }

            return DoUpdateDataSet(UpdateBehavior.Transactional,
                                   dataSet, tableName, insertCommand, updateCommand, deleteCommand, updateBatchSize);
        }

        /// <summary>
        /// <para>Calls the respective INSERT, UPDATE, or DELETE statements for each inserted, updated, or deleted row in the <see cref="DataSet"/> within a transaction.</para>
        /// </summary>        
        /// <param name="dataSet"><para>The <see cref="DataSet"/> used to update the data source.</para></param>
        /// <param name="tableName"><para>The name of the source table to use for table mapping.</para></param>
        /// <param name="insertCommand"><para>The <see cref="DbCommand"/> executed when <see cref="DataRowState"/> is <seealso cref="DataRowState.Added"/>.</para></param>
        /// <param name="updateCommand"><para>The <see cref="DbCommand"/> executed when <see cref="DataRowState"/> is <seealso cref="DataRowState.Modified"/>.</para></param>        
        /// <param name="deleteCommand"><para>The <see cref="DbCommand"/> executed when <see cref="DataRowState"/> is <seealso cref="DataRowState.Deleted"/>.</para></param>        
        /// <param name="transaction"><para>The <see cref="IDbTransaction"/> to use.</para></param>
        /// <returns>Number of records affected.</returns>        
        public int UpdateDataSet(DataSet dataSet,
                                 string tableName,
                                 DbCommand insertCommand,
                                 DbCommand updateCommand,
                                 DbCommand deleteCommand,
                                 DbTransaction transaction)
        {
            return UpdateDataSet(dataSet, tableName, insertCommand, updateCommand, deleteCommand, transaction, null);
        }

        #region Async methods

        /// <summary>
        /// Does this <see cref='Database'/> object support asynchronous execution?
        /// </summary>
        /// <value>Base class always returns false.</value>
        public virtual bool SupportsAsync
        {
            get { return false; }
        }

        /// <summary>
        /// <para>Initiates the asynchronous execution of the <see cref="DbCommand"/> which will return the number of affected records.</para>
        /// </summary>
        /// <param name="command">
        /// <para>The <see cref="DbCommand"/> to execute.</para>
        /// </param>
        /// <param name="callback">The async callback to execute when the result of the operation is available. Pass <langword>null</langword>
        /// if you don't want to use a callback.</param>
        /// <param name="state">Additional state object to pass to the callback.</param>
        /// <seealso cref="Database.ExecuteNonQuery(DbCommand)"/>
        /// <seealso cref="EndExecuteNonQuery(IAsyncResult)"/>
        /// <returns>
        /// <para>An <see cref="IAsyncResult"/> that can be used to poll or wait for results, or both; 
        /// this value is also needed when invoking <see cref="EndExecuteNonQuery"/>, 
        /// which returns the number of affected records.</para>
        /// </returns>
        public virtual IAsyncResult BeginExecuteNonQuery(DbCommand command, AsyncCallback callback, object state)
        {
            AsyncNotSupported();
            return null;
        }

        /// <summary>
        /// <para>Initiates the asynchronous execution of the <see cref="DbCommand"/> inside a transaction which will return the number of affected records.</para>
        /// </summary>
        /// <param name="command">
        /// <para>The <see cref="DbCommand"/> to execute.</para>
        /// </param>
        /// <param name="transaction">
        /// <para>The <see cref="DbTransaction"/> to execute the command within.</para>
        /// </param>
        /// <param name="callback">The async callback to execute when the result of the operation is available. Pass <langword>null</langword>
        /// if you don't want to use a callback.</param>
        /// <param name="state">Additional state object to pass to the callback.</param>
        /// <seealso cref="Database.ExecuteNonQuery(DbCommand)"/>
        /// <seealso cref="EndExecuteNonQuery(IAsyncResult)"/>
        /// <returns>
        /// <para>An <see cref="IAsyncResult"/> that can be used to poll or wait for results, or both; 
        /// this value is also needed when invoking <see cref="EndExecuteNonQuery"/>, 
        /// which returns the number of affected records.</para>
        /// </returns>
        public virtual IAsyncResult BeginExecuteNonQuery(DbCommand command, DbTransaction transaction, AsyncCallback callback,
                                          object state)
        {
            AsyncNotSupported();
            return null;
        }

        /// <summary>
        /// <para>Initiates the asynchronous execution of the <paramref name="storedProcedureName"/> using the given <paramref name="parameterValues" /> which will return the number of rows affected.</para>
        /// </summary>
        /// <param name="storedProcedureName">
        /// <para>The name of the stored procedure to execute.</para>
        /// </param>
        /// <param name="parameterValues">
        /// <para>An array of parameters to pass to the stored procedure. The parameter values must be in call order as they appear in the stored procedure.</para>
        /// </param>
        /// <param name="callback">The async callback to execute when the result of the operation is available. Pass <langword>null</langword>
        /// if you don't want to use a callback.</param>
        /// <param name="state">Additional state object to pass to the callback.</param>
        /// <returns>
        /// <para>An <see cref="IAsyncResult"/> that can be used to poll or wait for results, or both; 
        /// this value is also needed when invoking <see cref="EndExecuteNonQuery"/>, 
        /// which returns the number of affected records.</para>
        /// </returns>
        /// <seealso cref="Database.ExecuteNonQuery(string,object[])"/>
        /// <seealso cref="EndExecuteNonQuery(IAsyncResult)"/>
        public virtual IAsyncResult BeginExecuteNonQuery(string storedProcedureName, AsyncCallback callback, object state,
                                          params object[] parameterValues)
        {
            AsyncNotSupported();
            return null;
        }

        /// <summary>
        /// <para>Initiates the asynchronous execution of the <paramref name="storedProcedureName"/> using the given <paramref name="parameterValues" /> inside a transaction which will return the number of rows affected.</para>
        /// </summary>
        /// <param name="storedProcedureName">
        /// <para>The name of the stored procedure to execute.</para>
        /// </param>
        /// <param name="transaction">
        /// <para>The <see cref="DbTransaction"/> to execute the command within.</para>
        /// </param>
        /// <param name="callback">The async callback to execute when the result of the operation is available. Pass <langword>null</langword>
        /// if you don't want to use a callback.</param>
        /// <param name="state">Additional state object to pass to the callback.</param>
        /// <param name="parameterValues">
        /// <para>An array of parameters to pass to the stored procedure. The parameter values must be in call order as they appear in the stored procedure.</para>
        /// </param>
        /// <returns>
        /// <para>An <see cref="IAsyncResult"/> that can be used to poll or wait for results, or both; 
        /// this value is also needed when invoking <see cref="EndExecuteNonQuery"/>, 
        /// which returns the number of affected records.</para>
        /// </returns>
        /// <seealso cref="Database.ExecuteNonQuery(string,object[])"/>
        /// <seealso cref="EndExecuteNonQuery(IAsyncResult)"/>
        public virtual IAsyncResult BeginExecuteNonQuery(DbTransaction transaction,
            string storedProcedureName,
            AsyncCallback callback,
            object state,
            params object[] parameterValues)
        {
            AsyncNotSupported();
            return null;
        }

        /// <summary>
        /// <para>Initiates the asynchronous execution of the <paramref name="commandText"/> interpreted as specified by the <paramref name="commandType" /> which will return the number of rows affected.</para>
        /// </summary>
        /// <param name="commandType">
        /// <para>One of the <see cref="CommandType"/> values.</para>
        /// </param>
        /// <param name="commandText">
        /// <para>The command text to execute.</para>
        /// </param>
        /// <param name="callback">The async callback to execute when the result of the operation is available. Pass <langword>null</langword>
        /// if you don't want to use a callback.</param>
        /// <param name="state">Additional state object to pass to the callback.</param>
        /// <returns>
        /// <para>An <see cref="IAsyncResult"/> that can be used to poll or wait for results, or both; 
        /// this value is also needed when invoking <see cref="EndExecuteNonQuery"/>, 
        /// which returns the number of affected records.</para>
        /// </returns>
        /// <seealso cref="Database.ExecuteNonQuery(CommandType,string)"/>
        /// <seealso cref="EndExecuteNonQuery(IAsyncResult)"/>
        public virtual IAsyncResult BeginExecuteNonQuery(CommandType commandType,
            string commandText,
            AsyncCallback callback,
            object state)
        {
            AsyncNotSupported();
            return null;
        }

        /// <summary>
        /// <para>Initiates the asynchronous execution of the <paramref name="commandText"/> interpreted as specified by the <paramref name="commandType" /> inside a transaction which will return the number of rows affected.</para>
        /// </summary>
        /// <param name="commandType">
        /// <para>One of the <see cref="CommandType"/> values.</para>
        /// </param>
        /// <param name="commandText">
        /// <para>The command text to execute.</para>
        /// </param>
        /// <param name="transaction">
        /// <para>The <see cref="DbTransaction"/> to execute the command within.</para>
        /// </param>
        /// <param name="callback">The async callback to execute when the result of the operation is available. Pass <langword>null</langword>
        /// if you don't want to use a callback.</param>
        /// <param name="state">Additional state object to pass to the callback.</param>
        /// <returns>
        /// <para>An <see cref="IAsyncResult"/> that can be used to poll or wait for results, or both; 
        /// this value is also needed when invoking <see cref="EndExecuteNonQuery"/>, 
        /// which returns the number of affected records.</para>
        /// </returns>
        /// <seealso cref="Database.ExecuteNonQuery(CommandType,string)"/>
        /// <seealso cref="EndExecuteNonQuery(IAsyncResult)"/>
        public virtual IAsyncResult BeginExecuteNonQuery(DbTransaction transaction, CommandType commandType, string commandText,
                                          AsyncCallback callback, object state)
        {
            AsyncNotSupported();
            return null;
        }

        /// <summary>
        /// Finishes asynchronous execution of a SQL statement, returning the number of affected records.
        /// </summary>
        /// <param name="asyncResult">
        /// <para>The <see cref="IAsyncResult"/> returned by a call to any overload of <see cref="BeginExecuteNonQuery(DbCommand, AsyncCallback, object)"/>.</para>
        /// </param>
        /// <seealso cref="Database.ExecuteNonQuery(DbCommand)"/>
        /// <seealso cref="BeginExecuteNonQuery(DbCommand, AsyncCallback, object)"/>
        /// <seealso cref="BeginExecuteNonQuery(DbCommand, DbTransaction, AsyncCallback, object)"/>
        /// <returns>
        /// <para>The number of affected records.</para>
        /// </returns>
        public virtual int EndExecuteNonQuery(IAsyncResult asyncResult)
        {
            AsyncNotSupported();
            return 0;
        }

        /// <summary>
        /// <para>Initiates the asynchronous execution of a <paramref name="command"/> which will return a <see cref="IDataReader"/>.</para>
        /// </summary>
        /// <param name="command">
        /// <para>The <see cref="DbCommand"/> to execute.</para>
        /// </param>
        /// <param name="callback">The async callback to execute when the result of the operation is available. Pass <langword>null</langword>
        /// if you don't want to use a callback.</param>
        /// <param name="state">Additional state object to pass to the callback.</param>
        /// <returns>
        /// <para>An <see cref="IAsyncResult"/> that can be used to poll or wait for results, or both; 
        /// this value is also needed when invoking <see cref="EndExecuteReader"/>, 
        /// which returns the <see cref="IDataReader"/>.</para>
        /// </returns>
        /// <seealso cref="Database.ExecuteReader(DbCommand)"/>
        /// <seealso cref="EndExecuteReader(IAsyncResult)"/>
        public virtual IAsyncResult BeginExecuteReader(DbCommand command, AsyncCallback callback, object state)
        {
            AsyncNotSupported();
            return null;
        }

        /// <summary>
        /// <para>Initiates the asynchronous execution of a <paramref name="command"/> inside a transaction which will return a <see cref="IDataReader"/>.</para>
        /// </summary>
        /// <param name="command">
        /// <para>The <see cref="DbCommand"/> to execute.</para>
        /// </param>
        /// <param name="transaction">
        /// <para>The <see cref="DbTransaction"/> to execute the command within.</para>
        /// </param>
        /// <param name="callback">The async callback to execute when the result of the operation is available. Pass <langword>null</langword>
        /// if you don't want to use a callback.</param>
        /// <param name="state">Additional state object to pass to the callback.</param>
        /// <returns>
        /// <para>An <see cref="IAsyncResult"/> that can be used to poll or wait for results, or both; 
        /// this value is also needed when invoking <see cref="EndExecuteReader"/>, 
        /// which returns the <see cref="IDataReader"/>.</para>
        /// </returns>
        /// <seealso cref="Database.ExecuteReader(DbCommand)"/>
        /// <seealso cref="EndExecuteReader(IAsyncResult)"/>
        public virtual IAsyncResult BeginExecuteReader(DbCommand command, DbTransaction transaction, AsyncCallback callback,
                                        object state)
        {
            AsyncNotSupported();
            return null;
        }

        /// <summary>
        /// <para>Initiates the asynchronous execution of <paramref name="storedProcedureName"/> using the given <paramref name="parameterValues" /> which will return a <see cref="IDataReader"/>.</para>
        /// </summary>
        /// <param name="storedProcedureName">
        /// <para>The name of the stored procedure to execute.</para>
        /// </param>
        /// <param name="callback">The async callback to execute when the result of the operation is available. Pass <langword>null</langword>
        /// if you don't want to use a callback.</param>
        /// <param name="state">Additional state object to pass to the callback.</param>
        /// <param name="parameterValues">
        /// <para>An array of parameters to pass to the stored procedure. The parameter values must be in call order as they appear in the stored procedure.</para>
        /// </param>
        /// <returns>
        /// <para>An <see cref="IAsyncResult"/> that can be used to poll or wait for results, or both; 
        /// this value is also needed when invoking <see cref="EndExecuteReader"/>, 
        /// which returns the <see cref="IDataReader"/>.</para>
        /// </returns>
        /// <seealso cref="Database.ExecuteReader(string, object[])"/>
        /// <seealso cref="EndExecuteReader(IAsyncResult)"/>
        public virtual IAsyncResult BeginExecuteReader(string storedProcedureName, AsyncCallback callback, object state,
                                        params object[] parameterValues)
        {
            AsyncNotSupported();
            return null;
        }

        /// <summary>
        /// <para>Initiates the asynchronous execution of <paramref name="storedProcedureName"/> using the given <paramref name="parameterValues" /> inside a transaction which will return a <see cref="IDataReader"/>.</para>
        /// </summary>
        /// <param name="transaction">
        /// <para>The <see cref="DbTransaction"/> to execute the command within.</para>
        /// </param>
        /// <param name="storedProcedureName">
        /// <para>The name of the stored procedure to execute.</para>
        /// </param>
        /// <param name="callback">The async callback to execute when the result of the operation is available. Pass <langword>null</langword>
        /// if you don't want to use a callback.</param>
        /// <param name="state">Additional state object to pass to the callback.</param>
        /// <param name="parameterValues">
        /// <para>An array of parameters to pass to the stored procedure. The parameter values must be in call order as they appear in the stored procedure.</para>
        /// </param>
        /// <returns>
        /// <para>An <see cref="IAsyncResult"/> that can be used to poll or wait for results, or both; 
        /// this value is also needed when invoking <see cref="EndExecuteReader"/>, 
        /// which returns the <see cref="IDataReader"/>.</para>
        /// </returns>
        /// <seealso cref="Database.ExecuteReader(DbTransaction, string, object[])"/>
        /// <seealso cref="EndExecuteReader(IAsyncResult)"/>
        public virtual IAsyncResult BeginExecuteReader(DbTransaction transaction, string storedProcedureName, AsyncCallback callback,
                                        object state, params object[] parameterValues)
        {
            AsyncNotSupported();
            return null;
        }

        /// <summary>
        /// <para>Initiates the asynchronous execution of the <paramref name="commandText"/> 
        /// interpreted as specified by the <paramref name="commandType" /> which will return 
        /// a <see cref="IDataReader"/>. When the async operation completes, the
        /// <paramref name="callback"/> will be invoked on another thread to process the
        /// result.</para>
        /// </summary>
        /// <param name="commandType">
        /// <para>One of the <see cref="CommandType"/> values.</para>
        /// </param>
        /// <param name="commandText">
        /// <para>The command text to execute.</para>
        /// </param>
        /// <param name="callback"><see cref="AsyncCallback"/> to execute when the async operation
        /// completes.</param>
        /// <param name="state">State object passed to the callback.</param>
        /// <returns>
        /// <para>An <see cref="IAsyncResult"/> that can be used to poll or wait for results, or both; 
        /// this value is also needed when invoking <see cref="EndExecuteReader"/>, 
        /// which returns the <see cref="IDataReader"/>.</para>
        /// </returns>
        /// <seealso cref="Database.ExecuteReader(CommandType, string)"/>
        /// <seealso cref="EndExecuteReader(IAsyncResult)"/>
        public virtual IAsyncResult BeginExecuteReader(CommandType commandType, string commandText, AsyncCallback callback,
                                        object state)
        {
            AsyncNotSupported();
            return null;
        }


        /// <summary>
        /// <para>Initiates the asynchronous execution of the <paramref name="commandText"/> interpreted as specified by the <paramref name="commandType" /> inside an transaction which will return a <see cref="IDataReader"/>.</para>
        /// </summary>
        /// <param name="commandType">
        /// <para>One of the <see cref="CommandType"/> values.</para>
        /// </param>
        /// <param name="commandText">
        /// <para>The command text to execute.</para>
        /// </param>
        /// <param name="transaction">
        /// <para>The <see cref="DbTransaction"/> to execute the command within.</para>
        /// </param>
        /// <param name="callback">The async callback to execute when the result of the operation is available. Pass <langword>null</langword>
        /// if you don't want to use a callback.</param>
        /// <param name="state">Additional state object to pass to the callback.</param>
        /// <returns>
        /// <para>An <see cref="IAsyncResult"/> that can be used to poll or wait for results, or both; 
        /// this value is also needed when invoking <see cref="EndExecuteReader"/>, 
        /// which returns the <see cref="IDataReader"/>.</para>
        /// </returns>
        /// <seealso cref="Database.ExecuteReader(CommandType, string)"/>
        /// <seealso cref="EndExecuteReader(IAsyncResult)"/>
        public virtual IAsyncResult BeginExecuteReader(DbTransaction transaction, CommandType commandType, string commandText,
                                        AsyncCallback callback, object state)
        {
            AsyncNotSupported();
            return null;
        }

        /// <summary>
        /// Finishes asynchronous execution of a Transact-SQL statement, returning an <see cref="IDataReader"/>.
        /// </summary>
        /// <param name="asyncResult">
        /// <para>The <see cref="IAsyncResult"/> returned by a call to any overload of BeginExecuteReader.</para>
        /// </param>
        /// <seealso cref="Database.ExecuteReader(DbCommand)"/>
        /// <seealso cref="BeginExecuteReader(DbCommand,AsyncCallback,object)"/>
        /// <seealso cref="BeginExecuteReader(DbCommand, DbTransaction,AsyncCallback,object)"/>
        /// <returns>
        /// <para>An <see cref="IDataReader"/> object that can be used to consume the queried information.</para>
        /// </returns>     
        public virtual IDataReader EndExecuteReader(IAsyncResult asyncResult)
        {
            AsyncNotSupported();
            return null;
        }

        /// <summary>
        /// <para>Initiates the asynchronous execution of a <paramref name="command"/> which will return a single value.</para>
        /// </summary>
        /// <param name="command">
        /// <para>The <see cref="DbCommand"/> to execute.</para>
        /// </param>
        /// <param name="callback">The async callback to execute when the result of the operation is available. Pass <langword>null</langword>
        /// if you don't want to use a callback.</param>
        /// <param name="state">Additional state object to pass to the callback.</param>
        /// <returns>
        /// <para>An <see cref="IAsyncResult"/> that can be used to poll or wait for results, or both; 
        /// this value is also needed when invoking <see cref="EndExecuteScalar"/>, 
        /// which returns the actual result.</para>
        /// </returns>
        /// <seealso cref="Database.ExecuteScalar(DbCommand)"/>
        /// <seealso cref="EndExecuteScalar(IAsyncResult)"/>
        public virtual IAsyncResult BeginExecuteScalar(DbCommand command, AsyncCallback callback, object state)
        {
            AsyncNotSupported();
            return null;
        }

        /// <summary>
        /// <para>Initiates the asynchronous execution of a <paramref name="command"/> inside a transaction which will return a single value.</para>
        /// </summary>
        /// <param name="command">
        /// <para>The <see cref="DbCommand"/> to execute.</para>
        /// </param>
        /// <param name="transaction">
        /// <para>The <see cref="DbTransaction"/> to execute the command within.</para>
        /// </param>
        /// <param name="callback">The async callback to execute when the result of the operation is available. Pass <langword>null</langword>
        /// if you don't want to use a callback.</param>
        /// <param name="state">Additional state object to pass to the callback.</param>
        /// <returns>
        /// <para>An <see cref="IAsyncResult"/> that can be used to poll or wait for results, or both; 
        /// this value is also needed when invoking <see cref="EndExecuteScalar"/>, 
        /// which returns the actual result.</para>
        /// </returns>
        /// <seealso cref="Database.ExecuteScalar(DbCommand, DbTransaction)"/>
        /// <seealso cref="EndExecuteScalar(IAsyncResult)"/>
        public virtual IAsyncResult BeginExecuteScalar(DbCommand command, DbTransaction transaction, AsyncCallback callback,
                                        object state)
        {
            AsyncNotSupported();
            return null;
        }

        /// <summary>
        /// <para>Initiates the asynchronous execution of <paramref name="storedProcedureName"/> using the given <paramref name="parameterValues" /> which will return a single value.</para>
        /// </summary>
        /// <param name="storedProcedureName">
        /// <para>The name of the stored procedure to execute.</para>
        /// </param>
        /// <param name="callback">The async callback to execute when the result of the operation is available. Pass <langword>null</langword>
        /// if you don't want to use a callback.</param>
        /// <param name="state">Additional state object to pass to the callback.</param>
        /// <param name="parameterValues">
        /// <para>An array of parameters to pass to the stored procedure. The parameter values must be in call order as they appear in the stored procedure.</para>
        /// </param>
        /// <returns>
        /// <para>An <see cref="IAsyncResult"/> that can be used to poll or wait for results, or both; 
        /// this value is also needed when invoking <see cref="EndExecuteScalar"/>, 
        /// which returns the actual result.</para>
        /// </returns>
        /// <seealso cref="Database.ExecuteScalar(string, object[])"/>
        /// <seealso cref="EndExecuteScalar(IAsyncResult)"/>
        public virtual IAsyncResult BeginExecuteScalar(string storedProcedureName, AsyncCallback callback, object state,
                                        params object[] parameterValues)
        {
            AsyncNotSupported();
            return null;
        }

        /// <summary>
        /// <para>Initiates the asynchronous execution of <paramref name="storedProcedureName"/> using the given <paramref name="parameterValues" /> inside a transaction which will return a single value.</para>
        /// </summary>
        /// <param name="transaction">
        /// <para>The <see cref="DbTransaction"/> to execute the command within.</para>
        /// </param>
        /// <param name="storedProcedureName">
        /// <para>The name of the stored procedure to execute.</para>
        /// </param>
        /// <param name="callback">The async callback to execute when the result of the operation is available. Pass <langword>null</langword>
        /// if you don't want to use a callback.</param>
        /// <param name="state">Additional state object to pass to the callback.</param>
        /// <param name="parameterValues">
        /// <para>An array of parameters to pass to the stored procedure. The parameter values must be in call order as they appear in the stored procedure.</para>
        /// </param>
        /// <returns>
        /// <para>An <see cref="IAsyncResult"/> that can be used to poll or wait for results, or both; 
        /// this value is also needed when invoking <see cref="EndExecuteScalar"/>, 
        /// which returns the actual result.</para>
        /// </returns>
        /// <seealso cref="Database.ExecuteScalar(DbTransaction, string, object[])"/>
        /// <seealso cref="EndExecuteScalar(IAsyncResult)"/>
        public virtual IAsyncResult BeginExecuteScalar(DbTransaction transaction, string storedProcedureName, AsyncCallback callback,
                                        object state, params object[] parameterValues)
        {
            AsyncNotSupported();
            return null;
        }

        /// <summary>
        /// <para>Initiates the asynchronous execution of the <paramref name="commandText"/> interpreted as specified by the <paramref name="commandType" /> which will return a single value.</para>
        /// </summary>
        /// <param name="commandType">
        /// <para>One of the <see cref="CommandType"/> values.</para>
        /// </param>
        /// <param name="commandText">
        /// <para>The command text to execute.</para>
        /// </param>
        /// <param name="callback">The async callback to execute when the result of the operation is available. Pass <langword>null</langword>
        /// if you don't want to use a callback.</param>
        /// <param name="state">Additional state object to pass to the callback.</param>
        /// <returns>
        /// <para>An <see cref="IAsyncResult"/> that can be used to poll or wait for results, or both; 
        /// this value is also needed when invoking <see cref="EndExecuteScalar"/>, 
        /// which returns the actual result.</para>
        /// </returns>
        /// <seealso cref="Database.ExecuteScalar(CommandType, string)"/>
        /// <seealso cref="EndExecuteScalar(IAsyncResult)"/>
        public virtual IAsyncResult BeginExecuteScalar(CommandType commandType, string commandText, AsyncCallback callback,
                                        object state)
        {
            AsyncNotSupported();
            return null;
        }

        /// <summary>
        /// <para>Initiates the asynchronous execution of the <paramref name="commandText"/> interpreted as specified by the <paramref name="commandType" /> inside an transaction which will return a single value.</para>
        /// </summary>
        /// <param name="commandType">
        /// <para>One of the <see cref="CommandType"/> values.</para>
        /// </param>
        /// <param name="commandText">
        /// <para>The command text to execute.</para>
        /// </param>
        /// <param name="transaction">
        /// <para>The <see cref="DbTransaction"/> to execute the command within.</para>
        /// </param>
        /// <param name="callback">The async callback to execute when the result of the operation is available. Pass <langword>null</langword>
        /// if you don't want to use a callback.</param>
        /// <param name="state">Additional state object to pass to the callback.</param>
        /// <returns>
        /// <para>An <see cref="IAsyncResult"/> that can be used to poll or wait for results, or both; 
        /// this value is also needed when invoking <see cref="EndExecuteScalar"/>, 
        /// which returns the actual result.</para>
        /// </returns>
        /// <seealso cref="Database.ExecuteScalar(DbTransaction, CommandType, string)"/>
        /// <seealso cref="EndExecuteScalar(IAsyncResult)"/>
        public virtual IAsyncResult BeginExecuteScalar(DbTransaction transaction, CommandType commandType, string commandText,
                                        AsyncCallback callback, object state)
        {
            AsyncNotSupported();
            return null;
        }

        /// <summary>
        /// <para>Finishes asynchronous execution of a Transact-SQL statement, returning the first column of the first row in the result set returned by the query. Extra columns or rows are ignored.</para>
        /// </summary>
        /// <param name="asyncResult">
        /// <para>The <see cref="IAsyncResult"/> returned by a call to any overload of BeginExecuteScalar.</para>
        /// </param>
        /// <seealso cref="Database.ExecuteScalar(DbCommand)"/>
        /// <seealso cref="BeginExecuteScalar(DbCommand,AsyncCallback,object)"/>
        /// <seealso cref="BeginExecuteScalar(DbCommand,DbTransaction,AsyncCallback,object)"/>
        /// <returns>
        /// <para>The value of the first column of the first row in the result set returned by the query.
        /// If the result didn't have any columns or rows <see langword="null"/> (<b>Nothing</b> in Visual Basic).</para>
        /// </returns>     
        public virtual object EndExecuteScalar(IAsyncResult asyncResult)
        {
            AsyncNotSupported();
            return null;
        }

        private void AsyncNotSupported()
        {
            throw new InvalidOperationException(
                string.Format(
                CultureInfo.CurrentCulture,
                Resources.AsyncOperationsNotSupported,
                GetType().Name));
        }

        #endregion

        /// <summary>
        /// Returns the starting index for parameters in a command.
        /// </summary>
        /// <returns>The starting index for parameters in a command.</returns>
        protected virtual int UserParametersStartIndex(DbCommand command)
        {
            return 0;
        }

        #region 추가함수

        /// <summary>
        /// 리턴값 키
        /// </summary>
        public readonly static string ReturnValueKey = "RETURN_VALUE";

        /// <summary>
        /// AssignParameterValues
        /// </summary>
        /// <param name="command"></param>
        /// <param name="parameterDic"></param>
        private void AssignParameterValues(DbCommand command, IDictionary<string, object> parameterDic)
        {
            for (int i = command.Parameters.Count - 1; i >= UserParametersStartIndex(command); i--)
            {
                IDataParameter parameter = command.Parameters[i];

                // '@' 제거
                string paramName = RemoveParameterToken(parameter.ParameterName);
                if (parameterDic.ContainsKey(paramName)) SetParameterValue(command, parameter.ParameterName, parameterDic[paramName]);
                else
                {
                }
            }
        }

        /// <summary>
        /// AssignOutputAndReturnValue
        /// </summary>
        /// <param name="command"></param>
        /// <param name="parameterDic"></param>
        public virtual void AssignOutputAndReturnValue(DbCommand command, IDictionary<string, object> parameterDic)
        {
            foreach (DbParameter param in command.Parameters)
            {
                // OUTPUT 값 할당
                if (param.Direction == ParameterDirection.InputOutput || param.Direction == ParameterDirection.Output)
                {
                    parameterDic[RemoveParameterToken(param.ParameterName)] = param.Value;
                }
            }

            // RETURN VALUE 값 할당
            string returnValueKey = ReturnValueKey;
            if (parameterDic.ContainsKey(returnValueKey)) parameterDic[returnValueKey] = command.Parameters[0].Value;
            else parameterDic.Add(returnValueKey, command.Parameters[0].Value);
        }

        /// <summary>
        /// @없앤 파라미터명 리턴
        /// </summary>
        /// <param name="parameterName"></param>
        /// <returns></returns>
        protected virtual string RemoveParameterToken(string parameterName)
        {
            if (parameterName.StartsWith("@"))
                return parameterName.Remove(0, 1);

            return parameterName;
        }

        /// <summary>
        /// ExecuteDataSet 리턴벨류 버전
        /// </summary>
        /// <typeparam name="T">리턴값 형식</typeparam>
        /// <param name="storedProcedureName">
        /// <para>The stored procedure to execute.</para>
        /// </param>
        /// <param name="returnValue">리턴값</param>
        /// <param name="parameterValues"></param>
        /// <returns></returns>
        public virtual DataSet ExecuteDataSet<T>(string storedProcedureName,
                                                 out T returnValue,
                                                 params object[] parameterValues)
        {
            using (DbCommand command = GetStoredProcCommand(storedProcedureName, parameterValues))
            {
                DataSet ds = ExecuteDataSet(command);

                // 0번째 파라미터가 RETURN_VALUE
                returnValue = (T)command.Parameters[0].Value;

                return ds;
            }
        }

        /// <summary>
        /// ExecuteDataSet IDictionary 버전
        /// </summary>
        /// <param name="storedProcedureName"></param>
        /// <param name="parameterDic"></param>
        /// <returns></returns>
        public virtual DataSet ExecuteDataSet(string storedProcedureName,
                                              IDictionary<string, object> parameterDic)
        {
            using (DbCommand command = GetStoredProcCommand(storedProcedureName, parameterDic))
            {
                DataSet ds = ExecuteDataSet(command);

                AssignOutputAndReturnValue(command, parameterDic);

                return ds;
            }
        }

        /// <summary>
        /// ExecuteFunction
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="storedProcedureName"></param>
        /// <param name="parameterValues"></param>
        /// <returns></returns>
        public virtual T ExecuteFunction<T>(string storedProcedureName,
                                            params object[] parameterValues)

        {
            using (DbCommand command = GetStoredProcCommand(storedProcedureName, parameterValues))
            {
                ExecuteNonQuery(command);

                // 0번째 파라미터가 RETURN_VALUE
                T rtn = (T)PropertyMapping.ConvertValue(command.Parameters[0].Value, typeof(T));

                return rtn;
            }
        }

        /// <summary>
        /// ExecuteFunction IDictionary 버전
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="storedProcedureName"></param>
        /// <param name="parameterDic"></param>
        /// <returns></returns>
        public virtual int ExecuteFunction<T>(string storedProcedureName,
                                              IDictionary<string, object> parameterDic)
        {
            using (DbCommand command = GetStoredProcCommand(storedProcedureName, parameterDic))
            {
                ExecuteNonQuery(command);

                AssignOutputAndReturnValue(command, parameterDic);

                int rtn = Convert.ToInt32(command.Parameters[0].Value);

                return rtn;
            }
        }

        /// <summary>
        /// ExecuteNonQuery IDictionary 버전
        /// </summary>
        /// <param name="storedProcedureName"></param>
        /// <param name="parameterDic"></param>
        /// <returns></returns>
        public virtual int ExecuteNonQuery(string storedProcedureName,
                                           IDictionary<string, object> parameterDic)
        {
            using (DbCommand command = GetStoredProcCommand(storedProcedureName, parameterDic))
            {
                int rtn = ExecuteNonQuery(command);

                AssignOutputAndReturnValue(command, parameterDic);

                return rtn;
            }
        }

        /// <summary>
        /// ExecuteScalar params 버전
        /// </summary>
        /// <param name="storedProcedureName"></param>
        /// <param name="parameterValues"></param>
        /// <returns></returns>
        public virtual T ExecuteScalar<T>(string storedProcedureName,
                                          params object[] parameterValues)
        {
            using (DbCommand command = GetStoredProcCommand(storedProcedureName, parameterValues))
            {
                return (T)PropertyMapping.ConvertValue(ExecuteScalar(command), typeof(T));
            }
        }

        /// <summary>
        /// ExecuteScalar IDictionary 버전
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="storedProcedureName"></param>
        /// <param name="parameterDic"></param>
        /// <returns></returns>
        public virtual T ExecuteScalar<T>(string storedProcedureName,
                                          IDictionary<string, object> parameterDic)
        {
            using (DbCommand command = GetStoredProcCommand(storedProcedureName, parameterDic))
            {
                return (T)PropertyMapping.ConvertValue(ExecuteScalar(command), typeof(T));
            }
        }

        /// <summary>
        /// GetStoredProcCommand IDictionary 버전
        /// </summary>
        /// <param name="storedProcedureName"></param>
        /// <param name="parameterDic"></param>
        /// <returns></returns>
        public virtual DbCommand GetStoredProcCommand(string storedProcedureName,
                                                      IDictionary<string, object> parameterDic)
        {
            if (string.IsNullOrEmpty(storedProcedureName)) throw new ArgumentException(Resources.ExceptionNullOrEmptyString, "storedProcedureName");

            DbCommand command = CreateCommandByCommandType(CommandType.StoredProcedure, storedProcedureName);

            parameterCache.SetParameters(command, this);

            AssignParameterValues(command, parameterDic);

            return command;
        }

        /// <summary>
        /// 파라미터 Prefix
        /// </summary>
        /// <returns></returns>
        public virtual string GetParamPrefix()
        {
            return string.Empty;
        }

        public virtual int ExecuteNonQuery(string sp, dynamic entity)
        {
            using (DbCommand command = GetStoredProcCommand(sp, entity))
            {
                int rtn = ExecuteNonQuery(command);

                AssignResult(command, entity);

                return rtn;
            }
        }

        public virtual object ExecuteScalar(string sp, dynamic entity)
        {
            using (DbCommand command = GetStoredProcCommand(sp, entity))
            {
                return ExecuteScalar(command);
            }
        }

        public virtual IDataReader ExecuteReaderDic(string sp, IDictionary<string, object> parameterDic)
        {
            using (DbCommand command = GetStoredProcCommand(sp, parameterDic))
            {
                return ExecuteReader(command);
            }
        }

        public virtual IDataReader ExecuteReaderEntity(string sp, dynamic entity)
        {
            using (DbCommand command = GetStoredProcCommand(sp, entity))
            {
                return ExecuteReader(command);
            }
        }

        public virtual DataSet ExecuteStringDataSet(string sqlString, params object[] parames)
        {
            using (DbCommand command = GetSqlStringCommand(sqlString, parames))
            {
                DataSet ds = ExecuteDataSet(command);

                return ds;
            }
        }

        public virtual DataSet ExecuteStringDataSet(string sqlString, IDictionary<string, object> parameterDic)
        {
            using (DbCommand command = GetSqlStringCommand(sqlString, parameterDic))
            {
                DataSet ds = ExecuteDataSet(command);

                return ds;
            }
        }

        public virtual DataSet ExecuteStringDataSet(string sqlString, dynamic entity)
        {
            using (DbCommand command = GetSqlStringCommand(sqlString, entity))
            {
                DataSet ds = ExecuteDataSet(command);

                return ds;
            }
        }

        public virtual int ExecuteStringNonQuery(string sqlString, params object[] parames)
        {
            using (DbCommand command = GetSqlStringCommand(sqlString, parames))
            {
                return ExecuteNonQuery(command);
            }
        }

        public virtual int ExecuteStringNonQuery(string sqlString, IDictionary<string, object> parameterDic)
        {
            using (DbCommand command = GetSqlStringCommand(sqlString, parameterDic, true))
            {
                return ExecuteNonQuery(command);
            }
        }

        public virtual int ExecuteStringNonQuery(string sqlString, dynamic entity)
        {
            if (!IsDynamicOrEntity(entity))
                return ExecuteStringNonQuery(sqlString, new object[] { entity });

            using (DbCommand command = GetSqlStringCommand(sqlString, entity, true))
            {
                return ExecuteNonQuery(command);
            }
        }

        public virtual T ExecuteStringScalar<T>(string sqlString, params object[] parames)
        {
            using (DbCommand command = GetSqlStringCommand(sqlString, parames))
            {
                return (T)ConvertValue(ExecuteScalar(command), typeof(T));
            }
        }

        public virtual T ExecuteStringScalar<T>(string sqlString, IDictionary<string, object> parameterDic)
        {
            using (DbCommand command = GetSqlStringCommand(sqlString, parameterDic))
            {
                return (T)ConvertValue(ExecuteScalar(command), typeof(T));
            }
        }

        public virtual T ExecuteStringScalar<T>(string sqlString, dynamic entity)
        {
            if (!IsDynamicOrEntity(entity))
                return ExecuteStringScalar<T>(sqlString, new object[] { entity });

            using (DbCommand command = GetSqlStringCommand(sqlString, entity))
            {
                return (T)ConvertValue(ExecuteScalar(command), typeof(T));
            }
        }

        public virtual IDataReader ExecuteStringReader(string sqlString, params object[] parames)
        {
            using (DbCommand command = GetSqlStringCommand(sqlString, parames))
            {
                return ExecuteReader(command);
            }
        }

        public virtual IDataReader ExecuteStringReaderDic(string sqlString, IDictionary<string, object> parameterDic)
        {
            using (DbCommand command = GetSqlStringCommand(sqlString, parameterDic))
            {
                return ExecuteReader(command);
            }
        }

        public virtual IDataReader ExecuteStringReaderEntity(string sqlString, dynamic entity)
        {
            if (!IsDynamicOrEntity(entity))
                return ExecuteStringReaderEntity(sqlString, new object[] { entity });

            using (DbCommand command = GetSqlStringCommand(sqlString, entity))
            {
                return ExecuteReader(command);
            }
        }

        public List<T> EntityList<TParam, T>(CommandType commandType, string commandText, TParam parames)
            where T : new()
        {
            using (IDataReader reader = ExecuteReader(commandType, commandText, parames))
            {
                return Map<T>(reader).ToList();
            }
        }

        public Tuple<List<T1>, List<T2>> EntityList<TParam, T1, T2>(CommandType commandType, string commandText, TParam parames)
            where T1 : new()
            where T2 : new()
        {
            using (IDataReader reader = ExecuteReader(commandType, commandText, parames))
            {
                var t1 = Map<T1>(reader).ToList();
                reader.NextResult();
                var t2 = Map<T2>(reader).ToList();

                return new Tuple<List<T1>, List<T2>>(t1.ToList(), t2.ToList());
            }
        }

        public Tuple<List<T1>, List<T2>, List<T3>> EntityList<TParam, T1, T2, T3>(CommandType commandType, string commandText, TParam parames)
            where T1 : new()
            where T2 : new()
            where T3 : new()
        {
            using (IDataReader reader = ExecuteReader(commandType, commandText, parames))
            {
                var t1 = Map<T1>(reader).ToList();
                reader.NextResult();
                var t2 = Map<T2>(reader).ToList();
                reader.NextResult();
                var t3 = Map<T3>(reader).ToList();

                return new Tuple<List<T1>, List<T2>, List<T3>>(t1.ToList(), t2.ToList(), t3.ToList());
            }
        }

        public Tuple<List<T1>, List<T2>, List<T3>, List<T4>> EntityList<TParam, T1, T2, T3, T4>(CommandType commandType, string commandText, TParam parames)
            where T1 : new()
            where T2 : new()
            where T3 : new()
            where T4 : new()
        {
            using (IDataReader reader = ExecuteReader(commandType, commandText, parames))
            {
                var t1 = Map<T1>(reader).ToList();
                reader.NextResult();
                var t2 = Map<T2>(reader).ToList();
                reader.NextResult();
                var t3 = Map<T3>(reader).ToList();
                reader.NextResult();
                var t4 = Map<T4>(reader).ToList();

                return new Tuple<List<T1>, List<T2>, List<T3>, List<T4>>(t1.ToList(), t2.ToList(), t3.ToList(), t4.ToList());
            }
        }

        public Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>> EntityList<TParam, T1, T2, T3, T4, T5>(CommandType commandType, string commandText, TParam parames)
            where T1 : new()
            where T2 : new()
            where T3 : new()
            where T4 : new()
            where T5 : new()
        {
            using (IDataReader reader = ExecuteReader(commandType, commandText, parames))
            {
                var t1 = Map<T1>(reader).ToList();
                reader.NextResult();
                var t2 = Map<T2>(reader).ToList();
                reader.NextResult();
                var t3 = Map<T3>(reader).ToList();
                reader.NextResult();
                var t4 = Map<T4>(reader).ToList();
                reader.NextResult();
                var t5 = Map<T5>(reader).ToList();

                return new Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>>(t1.ToList(), t2.ToList(), t3.ToList(), t4.ToList(), t5.ToList());
            }
        }

        public Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>, List<T6>> EntityList<TParam, T1, T2, T3, T4, T5, T6>(CommandType commandType, string commandText, TParam parames)
            where T1 : new()
            where T2 : new()
            where T3 : new()
            where T4 : new()
            where T5 : new()
            where T6 : new()
        {
            using (IDataReader reader = ExecuteReader(commandType, commandText, parames))
            {
                var t1 = Map<T1>(reader).ToList();
                reader.NextResult();
                var t2 = Map<T2>(reader).ToList();
                reader.NextResult();
                var t3 = Map<T3>(reader).ToList();
                reader.NextResult();
                var t4 = Map<T4>(reader).ToList();
                reader.NextResult();
                var t5 = Map<T5>(reader).ToList();
                reader.NextResult();
                var t6 = Map<T6>(reader).ToList();

                return new Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>, List<T6>>(t1.ToList(), t2.ToList(), t3.ToList(), t4.ToList(), t5.ToList(), t6.ToList());
            }
        }

        public Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>, List<T6>, List<T7>> EntityList<TParam, T1, T2, T3, T4, T5, T6, T7>(CommandType commandType, string commandText, TParam parames)
            where T1 : new()
            where T2 : new()
            where T3 : new()
            where T4 : new()
            where T5 : new()
            where T6 : new()
            where T7 : new()
        {
            using (IDataReader reader = ExecuteReader(commandType, commandText, parames))
            {
                var t1 = Map<T1>(reader).ToList();
                reader.NextResult();
                var t2 = Map<T2>(reader).ToList();
                reader.NextResult();
                var t3 = Map<T3>(reader).ToList();
                reader.NextResult();
                var t4 = Map<T4>(reader).ToList();
                reader.NextResult();
                var t5 = Map<T5>(reader).ToList();
                reader.NextResult();
                var t6 = Map<T6>(reader).ToList();
                reader.NextResult();
                var t7 = Map<T7>(reader).ToList();

                return new Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>, List<T6>, List<T7>>(t1.ToList(), t2.ToList(), t3.ToList(), t4.ToList(), t5.ToList(), t6.ToList(), t7.ToList());
            }
        }

        public Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>, List<T6>, List<T7>, List<List<TRest>>> EntityList<TParam, T1, T2, T3, T4, T5, T6, T7, TRest>(CommandType commandType, string commandText, TParam parames)
            where T1 : new()
            where T2 : new()
            where T3 : new()
            where T4 : new()
            where T5 : new()
            where T6 : new()
            where T7 : new()
            where TRest : new()
        {
            using (IDataReader reader = ExecuteReader(commandType, commandText, parames))
            {
                var t1 = Map<T1>(reader).ToList();
                reader.NextResult();
                var t2 = Map<T2>(reader).ToList();
                reader.NextResult();
                var t3 = Map<T3>(reader).ToList();
                reader.NextResult();
                var t4 = Map<T4>(reader).ToList();
                reader.NextResult();
                var t5 = Map<T5>(reader).ToList();
                reader.NextResult();
                var t6 = Map<T6>(reader).ToList();
                reader.NextResult();
                var t7 = Map<T7>(reader).ToList();
                reader.NextResult();
                var trest = new List<List<TRest>>();
                do
                    trest.Add(Map<TRest>(reader).ToList());
                while (reader.NextResult());

                return new Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>, List<T6>, List<T7>, List<List<TRest>>>(t1.ToList(), t2.ToList(), t3.ToList(), t4.ToList(), t5.ToList(), t6.ToList(), t7.ToList(), trest);
            }
        }

        public IDataReader ExecuteReader<TParam>(CommandType commandType, string commandText, TParam parames)
        {
            switch (commandType)
            {
                case CommandType.Text:
                    switch (parames)
                    {
                        case IDictionary<string, object> dic:
                            return ExecuteStringReaderDic(commandText, dic);
                        case object entity:
                            if (!IsDynamicOrEntity(parames))
                                return ExecuteStringReader(commandText, new object[] { entity });

                            return ExecuteStringReaderEntity(commandText, entity);
                        default:
                            return null;
                    }
                case CommandType.StoredProcedure:
                    switch (parames)
                    {
                        case IDictionary<string, object> dic:
                            return ExecuteReaderDic(commandText, dic);
                        case object entity:
                            if (!IsDynamicOrEntity(parames))
                                return ExecuteReader(commandText, new object[] { entity });

                            return ExecuteReaderEntity(commandText, entity);
                        default:
                            return null;
                    }
                case CommandType.TableDirect:
                    throw new ApplicationException("TableDirect 사용 하지 않음");
            }

            return null;
        }

        public IEnumerable<T> Map<T>(IDataReader reader)
            where T : new()
        {
            var colList = DiscoverColumnList(reader);

            var properties =
                from property in (typeof(T) as Type).GetPublic()
                where IsAutoMappableProperty(property) && IsMap(property.Name, colList)
                select property;

            while (reader.Read())
                yield return MapRow<T>(reader, properties, colList);
        }

        public T MapRow<T>(IDataRecord row, IEnumerable<PropertyInfo> list, IEnumerable<string> colList)
            where T : new()
        {
            T t = new T();

            foreach (var pi in list)
            {
                pi.SetValue(t, GetValue(pi, row, colList), new object[0]);
            }

            return t;
        }

        private object GetValue(PropertyInfo pi, IDataRecord row, IEnumerable<string> colList)
        {
            int i = 0;
            var u = ToUpper(pi.Name);
            if (colList.Contains(u, StringComparer.OrdinalIgnoreCase))
                i = row.GetOrdinal(u);
            else
                i = row.GetOrdinal(pi.Name);

            var val = row[i];

            return ConvertValue(val, pi.PropertyType);
        }

        private IEnumerable<string> DiscoverColumnList(IDataReader reader)
        {
            for (int i = 0; i < reader.FieldCount; i++)
                yield return reader.GetName(i);
        }

        private bool IsMap(string name, IEnumerable<string> list)
        {
            return list.Contains(ToUpper(name), StringComparer.OrdinalIgnoreCase) || list.Contains(name, StringComparer.OrdinalIgnoreCase);
        }

        public virtual DbCommand GetStoredProcCommand(string sp, dynamic entity)
        {
            if (!IsDynamicOrEntity(entity))
                return GetStoredProcCommand(sp, new object[] { entity });

            if (string.IsNullOrEmpty(sp)) throw new ArgumentException("storedProcedureName is null");

            DbCommand command = CreateCommandByCommandType(CommandType.StoredProcedure, sp);

            parameterCache.SetParameters(command, this);

            AssignParameterEntity(command, entity);

            ConsoleCommand(command);

            return command;
        }

        public DbCommand GetSqlStringCommand(string sqlString, params object[] parames)
        {
            if (string.IsNullOrEmpty(sqlString)) throw new ArgumentException("sqlString is null");

            DbCommand command = CreateCommandByCommandType(CommandType.Text, sqlString);

            AddStringParameters(command, parames);

            ConsoleCommand(command);

            return command;
        }

        public DbCommand GetSqlStringCommand(string sqlString, IDictionary<string, object> parameterDic = null, bool isNonQuery = false)
        {
            if (string.IsNullOrEmpty(sqlString)) throw new ArgumentException("sqlString is null");

            DbCommand command = CreateCommandByCommandType(CommandType.Text, sqlString, parameterDic, isNonQuery);

            if (parameterDic != null)
            {
                AddStringParameters(command, parameterDic);
            }

            ConsoleCommand(command);

            return command;
        }

        public DbCommand GetSqlStringCommand(string sqlString, dynamic entity, bool isNonQuery = false)
        {
            if (!IsDynamicOrEntity(entity))
                return GetSqlStringCommand(sqlString, new object[] { entity });

            if (string.IsNullOrEmpty(sqlString)) throw new ArgumentException("sqlString is null");

            DbCommand command = CreateCommandByCommandType(CommandType.Text, sqlString, entity, isNonQuery);

            AddStringParameters(command, entity);

            ConsoleCommand(command);

            return command;
        }

        public void ConsoleStopwatch(Stopwatch watch)
        {
            if (!IsDevelopment())
            {
                LogStopwatch(watch);
                return;
            }

            try
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine("-------------------------------------------------------------------------------");
                Console.WriteLine("Execution Time: {0}", watch.Elapsed.ToString("mm':'ss':'fff"));
                Console.WriteLine("-------------------------------------------------------------------------------");
                Console.WriteLine(string.Empty);
                Console.ResetColor();
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex);
                return;
            }
        }

        public void LogStopwatch(Stopwatch watch)
        {
            try
            {
                StringBuilder sb = new StringBuilder();

                sb.AppendLine("-------------------------------------------------------------------------------");
                sb.AppendLine(string.Format("Execution Time: {0:mm':'ss':'fff}", watch.Elapsed));
                sb.AppendLine("-------------------------------------------------------------------------------");
                sb.AppendLine(string.Empty);

                _logger.LogInformation(sb.ToString());
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "LogStopwatch Error");
                return;
            }
        }

        public void ConsoleCommand(DbCommand command)
        {
            if (!IsDevelopment())
            {
                LogCommand(command);
                return;
            }

            try
            {
                Console.WriteLine(string.Empty);

                var parameters = command.Parameters.Cast<DbParameter>();

                if (parameters.Count() > 0)
                {
                    Console.ForegroundColor = ConsoleColor.Yellow;
                    Console.WriteLine("-------------------------------------------------------------------------------");
                    Console.WriteLine("Parameter List:");
                    Console.WriteLine("-------------------------------------------------------------------------------");
                    Console.WriteLine(string.Empty);
                    Console.ResetColor();

                    var nameMax = parameters.Max(x => x.ParameterName.Count());
                    var typeMax = parameters.Max(x => x.DbType.ToString().Count());

                    string nameFormat = $"{{0,-{nameMax}}}";
                    string typeFormat = $" [{{0,-{typeMax}}}] ";

                    foreach (DbParameter param in parameters)
                    {
                        Console.ForegroundColor = ConsoleColor.Yellow;
                        Console.Write(nameFormat, param.ParameterName);

                        Console.ForegroundColor = ConsoleColor.DarkGray;
                        Console.Write(typeFormat, param.DbType);

                        Console.ForegroundColor = ConsoleColor.White;
                        Console.Write(": {0}", param.Value);

                        Console.WriteLine(string.Empty);
                    }

                    Console.WriteLine(string.Empty);
                    Console.ResetColor();
                }

                Console.ForegroundColor = ConsoleColor.Green;
                Console.WriteLine("-------------------------------------------------------------------------------");
                Console.WriteLine("Parameter Query:");
                Console.WriteLine("-------------------------------------------------------------------------------");
                Console.ResetColor();
                Console.WriteLine(string.Empty);
                Console.WriteLine(command.CommandText);
                Console.WriteLine(string.Empty);
                Console.ResetColor();

                Console.ForegroundColor = ConsoleColor.Cyan;
                Console.WriteLine("-------------------------------------------------------------------------------");
                Console.WriteLine("Parameter Bound Query:");
                Console.WriteLine("-------------------------------------------------------------------------------");
                Console.ResetColor();
                Console.WriteLine(string.Empty);
                Console.WriteLine(ReplaceQueryParameter(command));
                Console.WriteLine(string.Empty);
                Console.ResetColor();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return;
            }
        }

        public void LogCommand(DbCommand command)
        {
            try
            {
                StringBuilder sb = new StringBuilder();

                sb.AppendLine(string.Empty);

                var parameters = command.Parameters.Cast<DbParameter>();

                if (parameters.Count() > 0)
                {
                    sb.AppendLine("-------------------------------------------------------------------------------");
                    sb.AppendLine("Parameter List:");
                    sb.AppendLine("-------------------------------------------------------------------------------");
                    sb.AppendLine(string.Empty);

                    var nameMax = parameters.Max(x => x.ParameterName.Count());
                    var typeMax = parameters.Max(x => x.DbType.ToString().Count());

                    string nameFormat = $"{{0,-{nameMax}}}";
                    string typeFormat = $" [{{0,-{typeMax}}}] ";

                    foreach (DbParameter param in parameters)
                    {
                        sb.AppendFormat(nameFormat, param.ParameterName);
                        sb.AppendFormat(typeFormat, param.DbType);
                        sb.AppendFormat(": {0}", param.Value);
                        sb.AppendLine(string.Empty);
                    }

                    sb.AppendLine(string.Empty);
                }

                sb.AppendLine("-------------------------------------------------------------------------------");
                sb.AppendLine("Parameter Query:");
                sb.AppendLine("-------------------------------------------------------------------------------");

                sb.AppendLine(string.Empty);
                sb.AppendLine(command.CommandText);
                sb.AppendLine(string.Empty);

                sb.AppendLine("-------------------------------------------------------------------------------");
                sb.AppendLine("Parameter Bound Query:");
                sb.AppendLine("-------------------------------------------------------------------------------");

                sb.AppendLine(string.Empty);
                sb.AppendLine(ReplaceQueryParameter(command));
                sb.AppendLine(string.Empty);

                _logger.LogInformation(sb.ToString());
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "LogCommand Error");
                return;
            }
        }

        public string ReplaceQueryParameter(DbCommand command)
        {
            StringBuilder sb = new StringBuilder(command.CommandText);

            List<string> paramList = ExtractParameters(command.CommandText);

            foreach (string param in paramList)
            {
                DbParameter dbParam = command.Parameters[param];

                ReplaceQueryParameterItem(sb, dbParam.ParameterName, dbParam.Value);
            }

            return sb.ToString();
        }

        public void ReplaceQueryParameterItem(StringBuilder sb, string key, object value)
        {
            foreach (var k in new[] { $"@{key}", $":{key}", $"?{key}" })
                sb.Replace(k, ToParamValue(value));
        }

        public string ToParamValue(object value)
        {
            string rtn = (string)PropertyMapping.ConvertValue(value, typeof(string));

            if (value is char)
                return $"'{rtn}'";

            if (value is string)
                return $"'{rtn}'";

            if (value is XDocument)
                return $"'{rtn}'";

            if (value is DateTime)
                return $"'{rtn}'";

            if (value is IEnumerable)
                return $"'{rtn}'";

            return rtn;
        }

        private void AssignParameterEntity(DbCommand command, dynamic entity)
        {
            for (int i = command.Parameters.Count - 1; i >= UserParametersStartIndex(command); i--)
            {
                IDataParameter parameter = command.Parameters[i];

                PropertyInfo pi = GetPropertyInfo(entity, parameter.ParameterName);

                if (pi == null)
                    continue;

                object value = pi.GetValue(entity, null);
                DbType type = FindParamterType(value, pi.PropertyType);

                SafeAddInParameter(command, parameter.ParameterName, type, value);
            }
        }

        DbCommand CreateCommandByCommandType(CommandType commandType, string commandText, IDictionary<string, object> parameterDic = null, bool isNonQuery = false)
        {
            DbCommand command = DbProviderFactory.CreateCommand();
            command.CommandType = commandType;
            command.CommandText = GetSql(commandText, isNonQuery ? null : parameterDic);

            return command;
        }

        DbCommand CreateCommandByCommandType(CommandType commandType, string commandText, dynamic entityt, bool isNonQuery = false)
        {
            DbCommand command = DbProviderFactory.CreateCommand();
            command.CommandType = commandType;
            command.CommandText = GetSql(commandText, isNonQuery ? null : entityt);

            return command;
        }

        string RefinePascalCase(string parameterName)
        {
            if (parameterName.StartsWith("@"))
                parameterName = parameterName.Remove(0, 1);

            return ToPascal(parameterName);
        }

        string RefineCamelCase(string parameterName)
        {
            if (parameterName.StartsWith("@"))
                parameterName = parameterName.Remove(0, 1);

            return ToCamel(parameterName);
        }

        string ToParameterName(string parameterName)
        {
            if (parameterName.StartsWith("@"))
                return parameterName;

            return $"@{parameterName}";
        }

        public virtual void AssignResult(DbCommand command, dynamic entity)
        {
            foreach (DbParameter param in command.Parameters)
            {
                if (IsOutput(param))
                {
                    string name = this.RefinePascalCase(param.ParameterName);
                    PropertyInfo pi = FindPropertyInfo(entity, name);

                    if (pi != null)
                        pi.SetValue(entity, param.Value, null);
                }
            }

            PropertyInfo rtn = FindPropertyInfo(entity, "ReturnValue");
            if (rtn != null)
                rtn.SetValue(entity, command.Parameters[0].Value, null);
        }

        bool IsOutput(DbParameter param)
        {
            return param.Direction == ParameterDirection.InputOutput ||
                param.Direction == ParameterDirection.Output;
        }

        public virtual void AddStringParameters(DbCommand command, params object[] parames)
        {
            if (command.CommandType != CommandType.Text)
                throw new InvalidOperationException("파라미터 쿼리에만 사용 가능");

            var parameterList = ExtractParameters(command.CommandText);

            if (parameterList.Count != parames.Length)
                throw new InvalidOperationException($"파라미터 숫자가 일치하지 않음 {command.CommandText} <> {string.Join(",", parames)}");

            for (int i = 0; i < parameterList.Count; i++)
            {
                var name = parameterList[i];
                object value = parames[i];
                DbType type = FindParamterType(value);

                SafeAddInParameter(command, name, type, value);
            }
        }

        public virtual void AddStringParameters(DbCommand command, IDictionary<string, object> parameterDic)
        {
            if (command.CommandType != CommandType.Text)
                throw new InvalidOperationException("파라미터 쿼리에만 사용 가능");

            var parameterList = ExtractParameters(command.CommandText);

            foreach (string name in parameterList)
            {
                object value = FindDictionaryValue(parameterDic, name);
                DbType type = FindParamterType(value);

                SafeAddInParameter(command, name, type, value);
            }
        }

        public virtual void AddStringParameters(DbCommand command, dynamic entity)
        {
            if (!IsDynamicOrEntity(entity))
                AddStringParameters(command, new object[] { entity });

            if (command.CommandType != CommandType.Text)
                throw new InvalidOperationException("파라미터 쿼리에만 사용 가능");

            var parameterList = ExtractParameters(command.CommandText);

            for (int i = 0; i < parameterList.Count; i++)
            {
                PropertyInfo pi = FindPropertyInfo(entity, parameterList[i]);

                if (pi == null)
                    continue;

                object value = pi.GetValue(entity, null);
                DbType type = FindParamterType(value, pi.PropertyType);

                SafeAddInParameter(command, parameterList[i], type, value);
            }
        }

        public PropertyInfo FindPropertyInfo(object obj, string name)
        {
            PropertyInfo pi = GetPropertyInfo(obj, RemoveParameterToken(name));
            if (pi != null)
                return pi;

            pi = GetPropertyInfo(obj, RefinePascalCase(name));
            if (pi != null)
                return pi;

            pi = GetPropertyInfo(obj, RefineCamelCase(name));
            if (pi != null)
                return pi;

            return pi;
        }

        public object FindDictionaryValue(IDictionary<string, object> dic, string name)
        {
            if(dic.ContainsKey(RemoveParameterToken(name)))
                return dic[RemoveParameterToken(name)];

            if (dic.ContainsKey(ToCamel(name)))
                return dic[ToCamel(name)];

            if (dic.ContainsKey(ToPascal(name)))
                return dic[ToPascal(name)];

            return null;
        }

        public PropertyInfo GetPropertyInfo(object obj, string name)
        {
            return obj.GetType().GetProperty(name, BindingFlags.Instance | BindingFlags.Public | BindingFlags.IgnoreCase);
        }

        public void SafeAddInParameter(DbCommand command, string name, DbType dbType, object value)
        {
            if (command.Parameters.Contains(ToParameterName(name)))
                return;

            if (dbType == DbType.Xml && value is XDocument)
                AddInParameter(command, name, dbType, value.ToString());
            else if (dbType == DbType.String && value is JArray)
                AddInParameter(command, name, dbType, JsonConvert.SerializeObject(value));
            else
                AddInParameter(command, name, dbType, value);
        }

        public static List<string> ExtractParameters(string sql)
        {
            var regex = new Regex(@"[:?@](?<Params>[a-zA-Z0-9_-]+)");
            var match = regex.Matches(sql);
            return match.Cast<Match>().Select(x => x.Groups["Params"].Value
                .Replace(";", string.Empty)
                .Replace(",", string.Empty)
                .Replace(")", string.Empty)).Distinct().ToList();
        }

        public virtual DbType FindParamterType(object value, Type type = null)
        {
            if(value != null)
                type = value.GetType();

            if (type == null)
                return DbType.Object;

            switch (type.Name)
            {
                case nameof(String):
                    return DbType.String;
                case nameof(Int32):
                    return DbType.Int32;
                case nameof(Decimal):
                    return DbType.Decimal;
                case nameof(Double):
                    return DbType.Double;
                case nameof(Int64):
                    return DbType.Int64;
                case nameof(Char):
                    return DbType.String;
                case nameof(DateTime):
                    return DbType.DateTime;
                case nameof(Byte) + "[]":
                    return DbType.Binary;
                case nameof(XDocument):
                    return DbType.Xml;
                case nameof(JArray):
                    return DbType.String;
                case nameof(IEnumerable):
                    return DbType.String;
                default:
                    return DbType.Object;
            }
        }

        public static bool IsAutoMappableProperty(PropertyInfo property)
        {
            return property.CanWrite
              && property.GetIndexParameters().Length == 0
              && !IsCollectionType(property.PropertyType)
            ;
        }

        public static bool IsCollectionType(Type type)
        {
            if (type == typeof(string)) return false;

            if (type == typeof(byte[])) return false;

            var interfaces = from inf in type.GetInterfaces()
                             where inf == typeof(IEnumerable) ||
                                 (inf.IsGenericType && inf.GetGenericTypeDefinition() == typeof(IEnumerable<>))
                             select inf;
            return interfaces.Count() != 0;
        }

        public static object ConvertValue(object value, Type conversionType)
        {
            if (IsNullableType(conversionType))
            {
                return ConvertNullableValue(value, conversionType);
            }
            return ConvertNonNullableValue(value, conversionType);
        }

        public static bool IsNullableType(Type t)
        {
            return t.IsGenericType &&
                   t.GetGenericTypeDefinition() == typeof(Nullable<>);
        }

        public static object ConvertNullableValue(object value, Type conversionType)
        {
            if (value != DBNull.Value)
            {
                var converter = new NullableConverter(conversionType);
                return converter.ConvertFrom(value);
            }
            return null;
        }

        public static object ConvertNonNullableValue(object value, Type conversionType)
        {
            object convertedValue = null;

            if (value != DBNull.Value)
            {
                convertedValue = Convert.ChangeType(value, conversionType, CultureInfo.CurrentCulture);
            }
            else if (conversionType.IsValueType)
            {
                convertedValue = Activator.CreateInstance(conversionType);
            }

            return convertedValue;
        }

        public string GetSql(string sql, IDictionary<string, object> parameterDic) => _sqlCache.BuildSql(GetSqlString(sql), parameterDic);
        public string GetSql(string sql, dynamic entity) => _sqlCache.BuildSql(GetSqlString(sql), entity);

        string GetSqlString(string sql)
        {
            if (sql.StartsWith("@"))
                return _sqlCache.GetSingleSql(ToSqlId(sql));

            return sql;
        }

        string ToSqlId(string sql) => sql.Substring(1);

        public static string ToUpper(string s)
        {
            if (string.IsNullOrWhiteSpace(s))
                return string.Empty;

            return Regex.Replace(s, "(?<=.)([A-Z])", "_$0", RegexOptions.Compiled).ToUpper();
        }

        public static string ToPascal(string s)
        {
            return CultureInfo.CurrentCulture.TextInfo.ToTitleCase(s.ToLower().Replace("_", " ")).Replace(" ", string.Empty);

        }

        public static string ToCamel(string s)
        {
            string t = ToPascal(s);
            return $"{char.ToLowerInvariant(t[0])}{t.Substring(1)}";
        }

        public static bool IsDynamicOrEntity(dynamic value)
        {
            if (value is BaseEntity)
                return true;

            if (value is ExpandoObject)
                return true;

            if (!(value is object))
                return false;

            return IsAnonymouse(((object)value).GetType());
        }

        public static bool IsAnonymouse(Type type)
        {
            return IsAnonymouse(type.GetTypeInfo());
        }

        public static bool IsAnonymouse(TypeInfo type)
        {
            bool hasCompilerGeneratedAttribute = type.GetCustomAttributes(typeof(CompilerGeneratedAttribute), false).Length > 0;
            bool nameContainsAnonymousType = type.FullName?.Contains("AnonymousType") ?? true;
            bool isAnonymousType = hasCompilerGeneratedAttribute && nameContainsAnonymousType;

            return isAnonymousType;
        }

        static public IEnumerable<Dictionary<string, object>> ToDic(DataTable dt, Func<string, string> columnNameFunc)
        {
            foreach (DataRow row in dt.Rows)
            {
                Dictionary<string, object> dic = new Dictionary<string, object>();

                foreach (DataColumn col in dt.Columns)
                {
                    dic.Add(columnNameFunc.Invoke(col.ColumnName), row[col]);
                }

                yield return dic;
            }
        }

        public static IEnumerable<dynamic> ToDynamic(DataTable dt, Func<string, string> columnNameFunc)
        {
            foreach (DataRow row in dt.Rows)
            {
                dynamic obj = new ExpandoObject();

                foreach (DataColumn col in dt.Columns)
                {
                    var dic = (IDictionary<string, object>)obj;
                    dic[columnNameFunc.Invoke(col.ColumnName)] = row[col];
                }

                yield return obj;
            }
        }

        #endregion

        /// <summary>
        ///        This is a helper class that is used to manage the lifetime of a connection for various
        ///        Execute methods. We needed this class to support implicit transactions created with
        ///        the <see cref="TransactionScope"/> class. In this case, the various Execute methods
        ///        need to use a shared connection instead of a new connection for each request in order
        ///        to prevent a distributed transaction.
        /// </summary>
        protected sealed class OldConnectionWrapper : IDisposable
        {
            readonly DbConnection connection;
            readonly bool disposeConnection;

            /// <summary>
            ///        Create a new "lifetime" container for a <see cref="DbConnection"/> instance.
            /// </summary>
            /// <param name="connection">The connection</param>
            /// <param name="disposeConnection">
            ///        Whether or not to dispose of the connection when this class is disposed.
            ///    </param>
            public OldConnectionWrapper(DbConnection connection,
                                     bool disposeConnection)
            {
                this.connection = connection;
                this.disposeConnection = disposeConnection;
            }

            /// <summary>
            ///        Gets the actual connection.
            /// </summary>
            public DbConnection Connection
            {
                get { return connection; }
            }

            /// <summary>
            ///        Dispose the wrapped connection, if appropriate.
            /// </summary>
            public void Dispose()
            {
                if (disposeConnection)
                {
                    connection.Dispose();
                }

                GC.SuppressFinalize(this);
            }
        }
    }
}
