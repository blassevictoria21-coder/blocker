import javax.swing.*;
import javax.swing.table.*;
import java.awt.*;
import java.awt.event.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

/**
 * PAGE 3: USER MANAGEMENT PAGE
 * Security Management System
 *
 * Features:
 * - View all system users
 * - Add new users (Admin only)
 * - Remove users (Admin only)
 * - Toggle user active/inactive status
 * - Role assignment (ADMIN / VIEWER)
 * - Search/filter users
 */
public class UserManagementPage extends JFrame {

    private String currentUser;
    private String currentRole;
    private boolean isAdmin;

    private DefaultTableModel tableModel;
    private JTable userTable;
    private JTextField searchField;
    private JLabel statusBar;

    // ── User data ──────────────────────────────────────────────────
    private static class User {
        String username, role, status, lastLogin;
        User(String u, String r, String s, String l) {
            username = u; role = r; status = s; lastLogin = l;
        }
        Object[] toRow() {
            return new Object[]{username, role, status, lastLogin};
        }
    }

    private List<User> userList = new ArrayList<>();

    // ── Colors ─────────────────────────────────────────────────────
    private static final Color BG_DARK     = new Color(15, 23, 42);
    private static final Color CARD_BG     = new Color(30, 41, 59);
    private static final Color RED_ACCENT  = new Color(220, 38, 38);
    private static final Color GREEN_OK    = new Color(34, 197, 94);
    private static final Color TEXT_LIGHT  = new Color(203, 213, 225);
    private static final Color TEXT_MUTED  = new Color(71, 85, 105);
    private static final Color BORDER_CLR  = new Color(51, 65, 85);

    // ── Constructor ────────────────────────────────────────────────
    public UserManagementPage(String username, String role) {
        this.currentUser = username;
        this.currentRole = role;
        this.isAdmin = "ADMIN".equalsIgnoreCase(role);

        setTitle("User Management — Logged in as: " + username + " [" + role + "]");
        setSize(820, 580);
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        setLocationRelativeTo(null);

        seedUsers();
        buildUI();
        setVisible(true);
    }

    // ── Seed demo users ───────────────────────────────────────────
    private void seedUsers() {
        userList.add(new User("admin",   "ADMIN",  "Active",   "2025-06-17 09:00:12"));
        userList.add(new User("officer", "VIEWER", "Active",   "2025-06-17 08:45:33"));
        userList.add(new User("manager", "ADMIN",  "Active",   "2025-06-16 17:22:01"));
        userList.add(new User("jdoe",    "VIEWER", "Inactive", "2025-06-10 11:05:47"));
        userList.add(new User("ksmith",  "VIEWER", "Active",   "2025-06-15 14:30:00"));
    }

    // ── Build UI ──────────────────────────────────────────────────
    private void buildUI() {
        JPanel main = new JPanel(new BorderLayout(0, 0));
        main.setBackground(BG_DARK);

        main.add(buildHeader(), BorderLayout.NORTH);
        main.add(buildContent(), BorderLayout.CENTER);
        main.add(buildStatusBar(), BorderLayout.SOUTH);
        add(main);
    }

    // ── Header ────────────────────────────────────────────────────
    private JPanel buildHeader() {
        JPanel header = new JPanel(new BorderLayout());
        header.setBackground(new Color(30, 41, 59));
        header.setPreferredSize(new Dimension(820, 55));
        header.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createMatteBorder(0, 0, 1, 0, BORDER_CLR),
            BorderFactory.createEmptyBorder(0, 20, 0, 20)
        ));

        JLabel title = new JLabel("👥  User Management");
        title.setForeground(Color.WHITE);
        title.setFont(new Font("Arial", Font.BOLD, 16));

        JPanel breadcrumb = new JPanel(new FlowLayout(FlowLayout.LEFT, 0, 18));
        breadcrumb.setOpaque(false);
        breadcrumb.add(title);

        // Search bar
        JPanel searchPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 12));
        searchPanel.setOpaque(false);
        JLabel searchIcon = new JLabel("🔍");
        searchField = new JTextField(14);
        searchField.setBackground(new Color(15, 23, 42));
        searchField.setForeground(TEXT_LIGHT);
        searchField.setCaretColor(Color.WHITE);
        searchField.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(BORDER_CLR),
            BorderFactory.createEmptyBorder(4, 8, 4, 8)
        ));
        searchField.setFont(new Font("Arial", Font.PLAIN, 12));
        searchField.getDocument().addDocumentListener(new javax.swing.event.DocumentListener() {
            public void changedUpdate(javax.swing.event.DocumentEvent e) { filterTable(); }
            public void removeUpdate(javax.swing.event.DocumentEvent e)  { filterTable(); }
            public void insertUpdate(javax.swing.event.DocumentEvent e)  { filterTable(); }
        });
        searchPanel.add(searchIcon);
        searchPanel.add(searchField);

        header.add(breadcrumb, BorderLayout.WEST);
        header.add(searchPanel, BorderLayout.EAST);
        return header;
    }

    // ── Main content: Table + Sidebar ─────────────────────────────
    private JPanel buildContent() {
        JPanel content = new JPanel(new BorderLayout(15, 0));
        content.setBackground(BG_DARK);
        content.setBorder(BorderFactory.createEmptyBorder(15, 15, 15, 15));

        content.add(buildTable(), BorderLayout.CENTER);
        content.add(buildSidebar(), BorderLayout.EAST);
        return content;
    }

    // ── User Table ────────────────────────────────────────────────
    private JScrollPane buildTable() {
        String[] cols = {"Username", "Role", "Status", "Last Login"};
        tableModel = new DefaultTableModel(cols, 0) {
            public boolean isCellEditable(int r, int c) { return false; }
        };

        refreshTable(userList);

        userTable = new JTable(tableModel);
        userTable.setBackground(CARD_BG);
        userTable.setForeground(TEXT_LIGHT);
        userTable.setFont(new Font("Courier New", Font.PLAIN, 12));
        userTable.setRowHeight(28);
        userTable.setGridColor(BORDER_CLR);
        userTable.setSelectionBackground(new Color(220, 38, 38, 80));
        userTable.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);

        // Header
        JTableHeader th = userTable.getTableHeader();
        th.setBackground(BG_DARK);
        th.setForeground(new Color(148, 163, 184));
        th.setFont(new Font("Arial", Font.BOLD, 12));
        th.setPreferredSize(new Dimension(0, 32));

        // Status column renderer
        userTable.getColumnModel().getColumn(2).setCellRenderer(new DefaultTableCellRenderer() {
            public Component getTableCellRendererComponent(JTable t, Object v,
                    boolean sel, boolean foc, int row, int col) {
                super.getTableCellRendererComponent(t, v, sel, foc, row, col);
                setBackground(sel ? new Color(220, 38, 38, 80) : CARD_BG);
                String val = v != null ? v.toString() : "";
                setForeground("Active".equalsIgnoreCase(val) ? GREEN_OK : RED_ACCENT);
                setFont(new Font("Arial", Font.BOLD, 11));
                return this;
            }
        });

        // Column widths
        userTable.getColumnModel().getColumn(0).setPreferredWidth(130);
        userTable.getColumnModel().getColumn(1).setPreferredWidth(100);
        userTable.getColumnModel().getColumn(2).setPreferredWidth(90);
        userTable.getColumnModel().getColumn(3).setPreferredWidth(160);

        JScrollPane scroll = new JScrollPane(userTable);
        scroll.getViewport().setBackground(CARD_BG);
        scroll.setBorder(BorderFactory.createTitledBorder(
            BorderFactory.createLineBorder(BORDER_CLR),
            "  System Users  (" + userList.size() + " total)",
            0, 0,
            new Font("Arial", Font.BOLD, 11),
            new Color(148, 163, 184)
        ));
        return scroll;
    }

    // ── Sidebar: Actions ─────────────────────────────────────────
    private JPanel buildSidebar() {
        JPanel sidebar = new JPanel();
        sidebar.setBackground(CARD_BG);
        sidebar.setPreferredSize(new Dimension(200, 0));
        sidebar.setLayout(new BoxLayout(sidebar, BoxLayout.Y_AXIS));
        sidebar.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(BORDER_CLR),
            BorderFactory.createEmptyBorder(15, 12, 15, 12)
        ));

        JLabel actionsTitle = new JLabel("ACTIONS");
        actionsTitle.setForeground(TEXT_MUTED);
        actionsTitle.setFont(new Font("Arial", Font.BOLD, 10));
        actionsTitle.setAlignmentX(Component.LEFT_ALIGNMENT);
        sidebar.add(actionsTitle);
        sidebar.add(Box.createVerticalStrut(12));

        if (isAdmin) {
            // Add User
            JButton addBtn = makeSidebarButton("➕  Add User", GREEN_OK);
            addBtn.addActionListener(e -> showAddUserDialog());
            sidebar.add(addBtn);
            sidebar.add(Box.createVerticalStrut(8));

            // Remove User
            JButton removeBtn = makeSidebarButton("🗑  Remove User", RED_ACCENT);
            removeBtn.addActionListener(e -> removeSelectedUser());
            sidebar.add(removeBtn);
            sidebar.add(Box.createVerticalStrut(8));

            // Toggle Status
            JButton toggleBtn = makeSidebarButton("🔄  Toggle Status", new Color(99, 102, 241));
            toggleBtn.addActionListener(e -> toggleUserStatus());
            sidebar.add(toggleBtn);
            sidebar.add(Box.createVerticalStrut(8));
        }

        // View Details (all roles)
        JButton detailBtn = makeSidebarButton("📋  View Details", new Color(14, 165, 233));
        detailBtn.addActionListener(e -> viewUserDetails());
        sidebar.add(detailBtn);
        sidebar.add(Box.createVerticalStrut(8));

        sidebar.add(Box.createVerticalGlue());

        // Role badge
        JLabel roleBadge = new JLabel("Role: " + currentRole, SwingConstants.CENTER);
        roleBadge.setFont(new Font("Arial", Font.BOLD, 11));
        roleBadge.setForeground(isAdmin ? new Color(250, 204, 21) : new Color(148, 163, 184));
        roleBadge.setAlignmentX(Component.CENTER_ALIGNMENT);
        sidebar.add(roleBadge);

        if (!isAdmin) {
            sidebar.add(Box.createVerticalStrut(6));
            JLabel readOnlyLabel = new JLabel("(View-only access)", SwingConstants.CENTER);
            readOnlyLabel.setFont(new Font("Arial", Font.ITALIC, 10));
            readOnlyLabel.setForeground(TEXT_MUTED);
            readOnlyLabel.setAlignmentX(Component.CENTER_ALIGNMENT);
            sidebar.add(readOnlyLabel);
        }

        return sidebar;
    }

    private JButton makeSidebarButton(String text, Color color) {
        JButton btn = new JButton(text);
        btn.setFont(new Font("Arial", Font.PLAIN, 12));
        btn.setForeground(color);
        btn.setBackground(new Color(15, 23, 42));
        btn.setFocusPainted(false);
        btn.setBorderPainted(true);
        btn.setBorder(BorderFactory.createLineBorder(color.darker(), 1));
        btn.setAlignmentX(Component.LEFT_ALIGNMENT);
        btn.setMaximumSize(new Dimension(180, 34));
        btn.setPreferredSize(new Dimension(180, 34));
        btn.setCursor(new Cursor(Cursor.HAND_CURSOR));
        return btn;
    }

    // ── Status Bar ────────────────────────────────────────────────
    private JPanel buildStatusBar() {
        JPanel bar = new JPanel(new FlowLayout(FlowLayout.LEFT, 15, 5));
        bar.setBackground(new Color(15, 23, 42));
        bar.setBorder(BorderFactory.createMatteBorder(1, 0, 0, 0, BORDER_CLR));
        statusBar = new JLabel("Ready.");
        statusBar.setForeground(TEXT_MUTED);
        statusBar.setFont(new Font("Arial", Font.PLAIN, 11));
        bar.add(statusBar);
        return bar;
    }

    // ── Actions ─────────────────────────────────────────────────
    private void showAddUserDialog() {
        JDialog dialog = new JDialog(this, "Add New User", true);
        dialog.setSize(360, 260);
        dialog.setLocationRelativeTo(this);
        dialog.getContentPane().setBackground(BG_DARK);

        JPanel panel = new JPanel(new GridBagLayout());
        panel.setBackground(BG_DARK);
        panel.setBorder(BorderFactory.createEmptyBorder(15, 20, 15, 20));
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(7, 5, 7, 5);
        gbc.fill = GridBagConstraints.HORIZONTAL;

        JTextField newUser = new JTextField(14);
        JPasswordField newPass = new JPasswordField(14);
        String[] roles = {"VIEWER", "ADMIN"};
        JComboBox<String> roleBox = new JComboBox<>(roles);
        roleBox.setBackground(CARD_BG);
        roleBox.setForeground(TEXT_LIGHT);

        styleDialogField(newUser);
        styleDialogField(newPass);

        addDialogRow(panel, gbc, 0, "Username:", newUser);
        addDialogRow(panel, gbc, 1, "Password:", newPass);
        addDialogRow(panel, gbc, 2, "Role:", roleBox);

        JButton save = new JButton("Add User");
        save.setBackground(GREEN_OK);
        save.setForeground(Color.WHITE);
        save.setFont(new Font("Arial", Font.BOLD, 12));
        save.setFocusPainted(false);
        save.setBorderPainted(false);
        save.addActionListener(e -> {
            String u = newUser.getText().trim();
            String r = roleBox.getSelectedItem().toString();
            if (u.isEmpty()) {
                JOptionPane.showMessageDialog(dialog, "Username cannot be empty.");
                return;
            }
            userList.add(new User(u, r, "Active", "Never"));
            refreshTable(userList);
            setStatus("User '" + u + "' added successfully.");
            dialog.dispose();
        });

        gbc.gridx = 0; gbc.gridy = 3; gbc.gridwidth = 2;
        panel.add(save, gbc);

        dialog.add(panel);
        dialog.setVisible(true);
    }

    private void addDialogRow(JPanel p, GridBagConstraints g, int row, String label, JComponent field) {
        g.gridx = 0; g.gridy = row; g.gridwidth = 1;
        JLabel lbl = new JLabel(label);
        lbl.setForeground(TEXT_LIGHT);
        lbl.setFont(new Font("Arial", Font.PLAIN, 12));
        p.add(lbl, g);
        g.gridx = 1;
        p.add(field, g);
    }

    private void styleDialogField(JTextField f) {
        f.setBackground(CARD_BG);
        f.setForeground(TEXT_LIGHT);
        f.setCaretColor(Color.WHITE);
        f.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(BORDER_CLR),
            BorderFactory.createEmptyBorder(4, 8, 4, 8)
        ));
    }

    private void removeSelectedUser() {
        int row = userTable.getSelectedRow();
        if (row < 0) { setStatus("Select a user to remove."); return; }
        String username = tableModel.getValueAt(row, 0).toString();
        if (username.equalsIgnoreCase(currentUser)) {
            JOptionPane.showMessageDialog(this, "You cannot remove your own account.");
            return;
        }
        int confirm = JOptionPane.showConfirmDialog(this,
            "Remove user '" + username + "'?", "Confirm Removal", JOptionPane.YES_NO_OPTION);
        if (confirm == JOptionPane.YES_OPTION) {
            userList.removeIf(u -> u.username.equalsIgnoreCase(username));
            refreshTable(userList);
            setStatus("User '" + username + "' removed.");
        }
    }

    private void toggleUserStatus() {
        int row = userTable.getSelectedRow();
        if (row < 0) { setStatus("Select a user to toggle status."); return; }
        String username = tableModel.getValueAt(row, 0).toString();
        for (User u : userList) {
            if (u.username.equalsIgnoreCase(username)) {
                u.status = "Active".equalsIgnoreCase(u.status) ? "Inactive" : "Active";
                refreshTable(userList);
                setStatus("User '" + username + "' status set to: " + u.status);
                return;
            }
        }
    }

    private void viewUserDetails() {
        int row = userTable.getSelectedRow();
        if (row < 0) { setStatus("Select a user to view details."); return; }
        String username  = tableModel.getValueAt(row, 0).toString();
        String role      = tableModel.getValueAt(row, 1).toString();
        String status    = tableModel.getValueAt(row, 2).toString();
        String lastLogin = tableModel.getValueAt(row, 3).toString();
        JOptionPane.showMessageDialog(this,
            "Username:   " + username + "\n" +
            "Role:       " + role + "\n" +
            "Status:     " + status + "\n" +
            "Last Login: " + lastLogin,
            "User Details", JOptionPane.INFORMATION_MESSAGE);
    }

    private void filterTable() {
        String query = searchField.getText().toLowerCase().trim();
        List<User> filtered = new ArrayList<>();
        for (User u : userList) {
            if (u.username.toLowerCase().contains(query) ||
                u.role.toLowerCase().contains(query) ||
                u.status.toLowerCase().contains(query)) {
                filtered.add(u);
            }
        }
        refreshTable(filtered);
        setStatus("Showing " + filtered.size() + " result(s) for: \"" + query + "\"");
    }

    private void refreshTable(List<User> list) {
        tableModel.setRowCount(0);
        for (User u : list) tableModel.addRow(u.toRow());
    }

    private void setStatus(String msg) {
        String time = LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss"));
        statusBar.setText("[" + time + "] " + msg);
    }
}
