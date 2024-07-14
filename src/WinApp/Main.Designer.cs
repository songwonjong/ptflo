namespace WinApp
{
    partial class Main
    {
        /// <summary>
        ///  Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        ///  Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        ///  Required method for Designer support - do not modify
        ///  the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.lvTest = new System.Windows.Forms.ListView();
            this.colGrpId = new System.Windows.Forms.ColumnHeader();
            this.colId = new System.Windows.Forms.ColumnHeader();
            this.colNm = new System.Windows.Forms.ColumnHeader();
            this.colUseYn = new System.Windows.Forms.ColumnHeader();
            this.colDelYn = new System.Windows.Forms.ColumnHeader();
            this.btnTestString = new System.Windows.Forms.Button();
            this.btnTestFile = new System.Windows.Forms.Button();
            this.SuspendLayout();
            // 
            // lvTest
            // 
            this.lvTest.Columns.AddRange(new System.Windows.Forms.ColumnHeader[] {
            this.colGrpId,
            this.colId,
            this.colNm,
            this.colUseYn,
            this.colDelYn});
            this.lvTest.Location = new System.Drawing.Point(12, 12);
            this.lvTest.Name = "lvTest";
            this.lvTest.Size = new System.Drawing.Size(776, 397);
            this.lvTest.TabIndex = 0;
            this.lvTest.UseCompatibleStateImageBehavior = false;
            this.lvTest.View = System.Windows.Forms.View.Details;
            // 
            // colGrpId
            // 
            this.colGrpId.Text = "Group ID";
            this.colGrpId.Width = 100;
            // 
            // colId
            // 
            this.colId.Text = "Code Id";
            this.colId.Width = 100;
            // 
            // colNm
            // 
            this.colNm.Text = "Code Name";
            this.colNm.Width = 300;
            // 
            // colUseYn
            // 
            this.colUseYn.Text = "Use YN";
            // 
            // colDelYn
            // 
            this.colDelYn.Text = "Del YN";
            // 
            // btnTestString
            // 
            this.btnTestString.Location = new System.Drawing.Point(713, 415);
            this.btnTestString.Name = "btnTestString";
            this.btnTestString.Size = new System.Drawing.Size(75, 23);
            this.btnTestString.TabIndex = 1;
            this.btnTestString.Text = "Test String";
            this.btnTestString.UseVisualStyleBackColor = true;
            this.btnTestString.Click += new System.EventHandler(this.btnTestString_Click);
            // 
            // btnTestFile
            // 
            this.btnTestFile.Location = new System.Drawing.Point(632, 415);
            this.btnTestFile.Name = "btnTestFile";
            this.btnTestFile.Size = new System.Drawing.Size(75, 23);
            this.btnTestFile.TabIndex = 2;
            this.btnTestFile.Text = "Test File";
            this.btnTestFile.UseVisualStyleBackColor = true;
            this.btnTestFile.Click += new System.EventHandler(this.btnTestFile_Click);
            // 
            // Main
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(800, 450);
            this.Controls.Add(this.btnTestFile);
            this.Controls.Add(this.btnTestString);
            this.Controls.Add(this.lvTest);
            this.Name = "Main";
            this.Text = "Form1";
            this.Load += new System.EventHandler(this.Main_Load);
            this.ResumeLayout(false);

        }

        #endregion

        private ListView lvTest;
        private Button btnTestString;
        private ColumnHeader colGrpId;
        private ColumnHeader colId;
        private ColumnHeader colNm;
        private ColumnHeader colUseYn;
        private ColumnHeader colDelYn;
        private Button btnTestFile;
    }
}