import collections
import sys
import ode
import os

from PySide6.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
    QTreeView, QPushButton, QLabel, QFrame, QStackedLayout, QTableView,
    QComboBox, QMenu, QMessageBox, QInputDialog
)

from PySide6.QtGui import QPixmap, QIcon, QDesktopServices, QAction
from PySide6.QtCore import Qt, QSize, QFileInfo, QTranslator, QFile, QTextStream
# https://bugreports.qt.io/browse/PYSIDE-1914
from PySide6.QtWidgets import QFileSystemModel

from ode.paths import Paths
from ode.errors_widget import ErrorsWidget
from ode.metadata_widget import FrictionlessResourceMetadataWidget
from ode.data_widget import FrictionlessTableModel
from ode.ai_widget import ChatGPTDialog
from ode.dialogs.upload import DataUploadDialog


class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()

        self.showMaximized()
        self.setWindowTitle("Open Data Editor")
        icon = QIcon(Paths.asset('icons/icon.png'))
        self.setWindowIcon(icon)

        # Main widget
        main_widget = QWidget()
        self.setCentralWidget(main_widget)

        # Main layout
        main_layout = QHBoxLayout()
        main_widget.setLayout(main_layout)

        # Sidebar layout
        sidebar_layout = QVBoxLayout()

        icon_label = QLabel()
        pixmap = QPixmap(Paths.asset("logo.svg"))
        icon_label.setPixmap(pixmap)
        icon_label.setAlignment(Qt.AlignmentFlag.AlignLeft)
        sidebar_layout.addWidget(icon_label)

        self.upload_dialog = DataUploadDialog(self)
        self.button_upload = QPushButton(objectName="button_upload")
        self.button_upload.clicked.connect(self.on_button_upload_click)

        self.file_navigator = QTreeView()
        self.file_model = QFileSystemModel()
        self.file_navigator.setModel(self.file_model)
        self.file_navigator.setRootIndex(self.file_model.setRootPath(str(Paths.PROJECT_PATH)))
        self._show_only_name_column_in_file_navigator(self.file_model, self.file_navigator)
        self.file_navigator.setHeaderHidden(True)
        self.file_navigator.clicked.connect(self.on_tree_click)
        self.file_navigator.setContextMenuPolicy(Qt.CustomContextMenu)
        self.file_navigator.customContextMenuRequested.connect(self._show_context_menu)
        self._setup_file_navigator_context_menu()

        self.user_guide = QPushButton()
        self.user_guide.setIcon(QIcon(Paths.asset("icons/24/menu-book.svg")))
        self.user_guide.setIconSize(QSize(20, 20))
        self.user_guide.setStyleSheet("text-align: left;")
        self.user_guide.clicked.connect(self.open_user_guide)

        self.report_issue = QPushButton()
        self.report_issue.setIcon(QIcon(Paths.asset("icons/24/report-issue.svg")))
        self.report_issue.setIconSize(QSize(20, 20))
        self.report_issue.setStyleSheet("text-align: left;")
        self.report_issue.clicked.connect(self.open_report_issue)

        self.language = QComboBox()
        options = [
            ("English", ""),
            ("Français", "fr"),
            ("Español", "es"),
            ("Português", "pt"),
        ]
        language_icon = QIcon(Paths.asset("icons/24/language.svg"))
        for i, (text, locale) in enumerate(options):
            self.language.addItem(text)
            self.language.setItemData(i, locale)
            self.language.setItemIcon(i, language_icon)
        self.language.setStyleSheet("text-align: left;")
        self.language.activated.connect(self.on_language_change)

        sidebar_layout.addWidget(self.button_upload)
        sidebar_layout.addWidget(self.file_navigator)
        sidebar_layout.addWidget(self.user_guide)
        sidebar_layout.addWidget(self.report_issue)
        sidebar_layout.addWidget(self.language)

        sidebar_frame = QFrame()
        sidebar_frame.setLayout(sidebar_layout)
        sidebar_frame.setFixedWidth(300)  # Set fixed width of 300 pixels
        sidebar_frame.setObjectName("sidebar")

        # Main content area
        main_content_layout = QVBoxLayout()

        # Toolbar layout for buttons
        toolbar_layout = QHBoxLayout()

        # Buttons on the left
        self.button_data = QPushButton()
        self.button_metadata = QPushButton()
        self.button_metadata.setIcon(QIcon(Paths.asset("icons/24/tune.svg")))
        self.button_metadata.setIconSize(QSize(20, 20))
        self.button_errors = QPushButton()
        self.button_errors.setIcon(QIcon(Paths.asset("icons/24/rule.svg")))
        self.button_errors.setIconSize(QSize(20, 20))
        self.button_source = QPushButton()
        self.button_source.setIcon(QIcon(Paths.asset("icons/24/code.svg")))
        self.button_source.setIconSize(QSize(20, 20))
        toolbar_layout.addWidget(self.button_data)
        toolbar_layout.addWidget(self.button_metadata)
        toolbar_layout.addWidget(self.button_errors)
        toolbar_layout.addWidget(self.button_source)

        # Spacer to push right-side buttons to the end
        toolbar_layout.addStretch()
        toolbar_layout.setSpacing(10)
        # Buttons on the right
        self.button_ai = QPushButton()
        self.button_ai.setIcon(QIcon(Paths.asset("icons/24/wand.svg")))
        self.button_ai.setIconSize(QSize(20, 20))
        self.ai_widget = ChatGPTDialog(self)
        self.button_publish = QPushButton(objectName="button_publish")
        self.button_publish.setIcon(QIcon(Paths.asset("icons/24/electric-bolt.svg")))
        self.button_publish.setIconSize(QSize(20, 20))
        self.button_save = QPushButton(objectName="button_save")
        self.button_save.setMinimumSize(QSize(117, 35))
        self.button_save.setIcon(QIcon(Paths.asset("icons/24/check.svg")))
        self.button_save.setIconSize(QSize(20, 20))
        self.button_save.clicked.connect(self.on_save_click)
        self.button_ai.clicked.connect(self.on_ai_click)
        # update_qss_button = QPushButton("QSS")
        # update_qss_button.clicked.connect(self.apply_stylesheet)
        # toolbar_layout.addWidget(update_qss_button)
        toolbar_layout.addWidget(self.button_ai)
        toolbar_layout.addWidget(self.button_publish)
        toolbar_layout.addWidget(self.button_save)

        main_content_layout.addLayout(toolbar_layout)

        # Main content (stacked layout)
        self.stacked_layout = QStackedLayout()

        self.data_view = QTableView()
        self.metadata_widget = FrictionlessResourceMetadataWidget()
        self.errors_view = ErrorsWidget()

        self.stacked_layout.addWidget(self.data_view)
        self.stacked_layout.addWidget(self.metadata_widget)
        self.stacked_layout.addWidget(self.errors_view)

        main_content_layout.addLayout(self.stacked_layout)

        self.button_data.clicked.connect(lambda: self.stacked_layout.setCurrentIndex(0))
        self.button_metadata.clicked.connect(lambda: self.stacked_layout.setCurrentIndex(1))
        self.button_errors.clicked.connect(lambda: self.stacked_layout.setCurrentIndex(2))

        # Main content frame
        main_content_frame = QFrame()
        main_content_frame.setLayout(main_content_layout)

        # Add sidebar and main content to main layout
        main_layout.addWidget(sidebar_frame)
        main_layout.addWidget(main_content_frame)

        self._menu_bar()

        # Translation
        self.translator = QTranslator()
        self.retranslateUI()

        self.apply_stylesheet()

    def _setup_file_navigator_context_menu(self):
        """Create the context menu for the file navigator."""
        self.context_menu = QMenu(self)

        self.rename_action = QAction()
        self.open_location_action = QAction()
        self.delete_action = QAction()

        self.rename_action.triggered.connect(self._rename_file_navigator_item)
        self.open_location_action.triggered.connect(self._open_file_navigator_location)
        self.delete_action.triggered.connect(self._delete_file_navitagor_item)

        self.context_menu.addAction(self.rename_action)
        self.context_menu.addAction(self.open_location_action)
        self.context_menu.addAction(self.delete_action)

    def _show_context_menu(self, position):
        """Show the context menu for a specific index at the specific position."""
        index = self.file_navigator.indexAt(position)
        if index.isValid():
            global_pos = self.file_navigator.viewport().mapToGlobal(position)
            self.context_menu.exec(global_pos)

    def _rename_file_navigator_item(self):
        """Ask user for the new name for the selected file/folder."""
        index = self.file_navigator.currentIndex()
        if index.isValid():
            file_path = self.file_model.filePath(index)

            new_name, ok = QInputDialog.getText(
                self, self.tr("Rename"), self.tr("Enter new name:"), text=os.path.basename(file_path)
            )
            if ok and new_name:
                new_path = os.path.join(os.path.dirname(file_path), new_name)
                try:
                    os.rename(file_path, new_path)
                except IsADirectoryError:
                    QMessageBox.warning(
                        self, self.tr("Error"), self.tr("Source is a file but destination a directory.")
                    )
                except NotADirectoryError:
                    QMessageBox.warning(
                        self, self.tr("Error"), self.tr("Source is a directory but destination a file."))
                except PermissionError:
                    # Since we have a managed PROJECT_PATH this should never happen.
                    QMessageBox.warning(self, self.tr("Error"), self.tr("Operation not permitted."))
                except OSError as e:
                    QMessageBox.warning(self, self.tr("Error"), self.tr("Error: {e}").format(e))

    def _open_file_navigator_location(self):
        """Open the folder where the file lives using the OS application."""
        index = self.file_navigator.currentIndex()
        if index.isValid():
            path = self.file_model.filePath(index)
            folder = os.path.dirname(path)
            if sys.platform == "win32":
                os.system(f'explorer.exe "{folder}"')
            elif sys.platform == "darwin":
                os.system(f'open "{folder}"')
            else:
                os.system(f'xdg-open "{folder}"')

    def _delete_file_navitagor_item(self):
        """Delete a file/folder from the file navigator (and the OS)."""
        index = self.file_navigator.currentIndex()
        if index.isValid():
            file_path = self.file_model.filePath(index)

            confirm = QMessageBox.question(
                self, self.tr("Delete"), self.tr("Are you sure you want to delete this?"),
                QMessageBox.Yes | QMessageBox.No
            )
            if confirm == QMessageBox.Yes:
                try:
                    if os.path.isfile(file_path):
                        os.remove(file_path)
                    elif os.path.isdir(file_path):
                        os.rmdir(file_path)
                except OSError as e:
                    QMessageBox.warning(self, self.tr("Error"), self.tr("Failed to delete: {e}").format(e))

    def _menu_bar(self):
        """Creates the menu bar and assign all its actions.

        Names and titles are going to be set in retranslateUI.
        """
        self.menu_file = QMenu()
        self.action_upload_file = QAction()
        self.menu_file.addAction(self.action_upload_file)
        self.menuBar().addMenu(self.menu_file)

        self.menu_edit = QMenu()
        self.menuBar().addMenu(self.menu_edit)

        self.menu_view = QMenu()
        self.menuBar().addMenu(self.menu_view)

        self.menu_help = QMenu()
        self.menuBar().addMenu(self.menu_help)

    def apply_stylesheet(self):
        """Reads our main style QSS file and applies it to the application.

        Tip: this method can be connected to a button to live reload changes.
        """
        qss_file = QFile(Paths.asset("style.qss"))
        qss_file.open(QFile.ReadOnly)
        qss_content = QTextStream(qss_file).readAll()
        self.setStyleSheet(qss_content)

    def on_ai_click(self):
        self.ai_widget.show()

    def retranslateUI(self):
        """Set the text of all the UI elements using a translation function.

        retranslateUI is a pattern used in Qt to handle the dynamic updates
        of languages. All text that needs to be translated needs to be set inside
        this function so we can call it to refresh the UI.

        This method should be call when:
          a) The application is load for the first time (MainWindow.__init__)
          b) Every time the user selects a different language (language ComboBox)
          c) An event related to language change is fired (like the user changing
          the language in the OS. Not Implemented yet).
        """
        self.button_upload.setText(self.tr("Upload your data"))
        self.user_guide.setText(self.tr("User guide"))
        self.report_issue.setText(self.tr("Report an issue"))
        self.button_data.setText(self.tr("Data"))
        self.button_metadata.setText(self.tr("Metadata"))
        self.button_errors.setText(self.tr("Errors Report"))
        self.button_source.setText(self.tr("Source"))
        self.button_publish.setText(self.tr("Publish"))
        self.button_save.setText(self.tr("Save changes"))
        self.button_ai.setText(self.tr("AI"))

        # Update translated text for menus
        self.menu_file.setTitle(self.tr("File"))
        self.action_upload_file.setText(self.tr("Open"))
        self.menu_edit.setTitle(self.tr("Edit"))
        self.menu_view.setTitle(self.tr("View"))
        self.menu_help.setTitle(self.tr("Help"))

        # Update text for file navitagor context menu
        self.rename_action.setText(self.tr("Rename"))
        self.open_location_action.setText(self.tr("Open File in Location"))
        self.delete_action.setText(self.tr("Delete"))

        # Hook retranslateUI for all other widgets. (data, errors, metadata, etc)
        self.ai_widget.retranslateUI()
        self.upload_dialog.retranslateUI()

    def on_language_change(self, index):
        """Gets a *.qm translation file and calls retranslateUI.

        Translation files are generated using Qt tools pyside6-lupdate and
        pyside6-lrelease.
        """
        locale = self.language.itemData(index)
        app = QApplication.instance()
        if not locale:
            app.removeTranslator(self.translator)
            self.retranslateUI()
            return

        filename = locale + ".qm"
        filepath = Paths.translation(filename)
        if self.translator.load(filepath):
            app.installTranslator(self.translator)
        else:
            print(f"Error when loading {filepath} translator file. Fallbacking to English.")
            app.removeTranslator(self.translator)
        self.retranslateUI()

    def on_button_upload_click(self):
        """Copy data file to the project folder of ode."""
        self.upload_dialog.show()

    def on_save_click(self, checked):
        """Saves changes made in the Table View into the file.

        # TODO: This is an early implementation, we need to define
        signals and slots properly.
        """
        if not hasattr(self, 'table_model'):
            # TODO: Define behaviour of Save Button
            return
        self.table_model.write_data()
        self.table_model.layoutChanged.emit()
        self.metadata_widget.save_metadata_to_descriptor_file()

    def on_tree_click(self, index):
        """ Handle reading tabular data on file selection

        This method will be triggered when the user clicks on a file in the
        QTreeView. It will load the file and update our table_model and data_view.
        """
        path = self.sender().model().filePath(index)
        info = QFileInfo(path)
        if info.isFile() and info.suffix() in ['csv', 'xls', 'xlsx']:
            self.table_model = FrictionlessTableModel(path)
            self.data_view.setModel(self.table_model)
            self.errors_view.remove_all_errors()
            errors_list = self._sort_frictionless_errors(self.table_model.errors)
            for error in errors_list:
                self.errors_view.add_error(error, self.table_model)
            self.metadata_widget.populate_all_forms(path)

    def _show_only_name_column_in_file_navigator(self, file_model, file_navigator):
        """Hide all columns except for the name column (column 0)"""
        for column in range(file_model.columnCount()):
            if column != 0:  # 0 is the name column
                file_navigator.setColumnHidden(column, True)

    def _sort_frictionless_errors(self, errors):
        """Splits a list of dictionaries into several lists grouped by type.

        Frictionless returns an array of Error objects, since we want to create an
        ErrorReport for each type of error, we rearrange the array into a list of
        arrays in which each one contains only one error type.
        """
        result = collections.defaultdict(list)
        for error in errors:
            result[error.type].append(error)
        return list(result.values())

    def open_user_guide(self):
        QDesktopServices.openUrl("https://opendataeditor.okfn.org/documentation/getting-started/")

    def open_report_issue(self):
        QDesktopServices.openUrl("https://github.com/okfn/opendataeditor")


if __name__ == "__main__":
    app = QApplication(sys.argv)
    app.setApplicationName("Open Data Editor")
    app.setApplicationVersion(ode.__version__)
    window = MainWindow()
    window.show()
    sys.exit(app.exec())
